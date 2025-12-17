// backend/lambdas/llmHandler.js
const https = require("https");

async function callGroq({ model, prompt }) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set");

    // --- CRITICAL FIX 1: Use the standard Chat Completions Endpoint ---
    const GROQ_PATH = "/openai/v1/chat/completions";

    // --- CRITICAL FIX 2: Use the standard Chat Completions Payload format ---
    const payload = JSON.stringify({
        model: model,
        messages: [
            {
                role: "user",
                content: prompt // Simple string content is correct for chat completion
            }
        ],
        // Optional parameters to improve response quality:
        temperature: 0.7,
        max_tokens: 2048 
    });

    const options = {
        hostname: "api.groq.com",
        path: GROQ_PATH, // Corrected path
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "Content-Length": Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", chunk => (data += chunk));
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    
                    // Groq API sends a 400 status if the request body is wrong
                    if (res.statusCode !== 200) {
                        return reject(new Error(`Groq API Error (${res.statusCode}): ${json.error?.message || data}`));
                    }
                    
                    // --- CRITICAL FIX 3: Parse the standard Chat Completion Response ---
                    const completionText = 
                        json.choices?.[0]?.message?.content || 
                        "[No text returned by model]";
                    
                    // Extract usage metrics (optional, but good practice)
                    const usageDetails = json.usage || {};

                    // Resolve with the text and usage details
                    resolve({ text: completionText, usageDetails: usageDetails });

                } catch (err) {
                    console.error("Failed to parse Groq response JSON:", data);
                    reject(new Error(`Failed to parse Groq response: ${err.message}`));
                }
            });
        });

        req.on("error", reject);
        req.write(payload);
        req.end();
    });
}

async function route({ payload }) {
    const start = Date.now();

    if (payload.provider.toLowerCase() !== "groq") {
        throw new Error(`Unsupported provider: ${payload.provider}`);
    }

    // Call Groq and destructure the returned object
    const { text, usageDetails } = await callGroq({
        model: payload.model,
        prompt: payload.prompt
    });

    // We now have usageDetails from the LLM call
    const usage = {
        provider: "groq",
        model: payload.model,
        userId: payload.userId,
        projectId: payload.projectId,
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - start,
        // Add specific token counts from Groq's response
        inputTokens: usageDetails.prompt_tokens || 0,
        outputTokens: usageDetails.completion_tokens || 0,
        totalTokens: usageDetails.total_tokens || 0,
    };

    return {
        result: {
            provider: "groq",
            model: payload.model,
            text // Renamed from 'result' to 'text' for clarity in LLM response
        },
        usage
    };
}

module.exports = { route };