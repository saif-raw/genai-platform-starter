// backend/lambdas/getAiResponse.js
const { route } = require("./llmHandler");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

let ddb;
try {
  ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
} catch {
  ddb = null;
}

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
};

exports.handler = async (event) => {
  try {
    const path = event.requestContext?.resourcePath || event.path || "";
    const qs = event.queryStringParameters || {};
    // const now = new Date().toISOString(); // Not used, can be removed or left.

    // Handle OPTIONS pre-flight request
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: defaultHeaders, body: JSON.stringify({ ok: true }) };
    }

    // Handle GET /hello endpoint
    if (event.httpMethod === "GET" && path.endsWith("/hello")) {
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({ ok: true, message: "GenAI endpoint active" })
      };
    }

    // -------- BULLETPROOF BODY PARSING (Simplified) --------
    let body = {};
    let rawBody = event.body;

    if (rawBody) {
      // 1. Base64 decode if required (Standard API Gateway Proxy Behavior)
      if (event.isBase64Encoded) {
        rawBody = Buffer.from(rawBody, "base64").toString("utf-8");
      }

      try {
        // 2. Parse the JSON string
        body = JSON.parse(rawBody);

        // 3. Handle double-encoded JSON (if the initial parse yields a string)
        if (typeof body === "string") {
          body = JSON.parse(body);
        }
      } catch (err) {
        console.error("BODY PARSE FAILED:", err, rawBody);
        return {
          statusCode: 400,
          headers: defaultHeaders,
          body: JSON.stringify({
            error: "Invalid JSON body or malformed request.",
            hint: "Ensure your curl command is properly escaping the JSON payload, especially on Windows CMD."
          })
        };
      }
    }

    // Construct payload, prioritizing body, then querystring, then environment variables
    const payload = {
      provider: body.provider || qs.provider || process.env.DEFAULT_PROVIDER,
      model: body.model || qs.model || process.env.DEFAULT_MODEL,
      prompt: body.prompt || qs.prompt || "Hello!",
      userId: body.userId || qs.userId || "anonymous",
      projectId: body.projectId || qs.projectId || "default-project"
    };

    // Route to the LLM handler
    //const { result, usage } = await route({ payload });
    // --- CRITICAL DEBUGGING STEP ---
    console.log("Final Payload for LLM:", JSON.stringify(payload, null, 2));

    // Route to the LLM handler
    const { result, usage } = await route({ payload });


    // Write usage to DynamoDB
    if (process.env.USAGE_TABLE_NAME && ddb) {
      try {
        await ddb.send(new PutCommand({
          TableName: process.env.USAGE_TABLE_NAME,
          Item: {
            id: `${usage.timestamp}#${Math.random().toString(36).slice(2, 8)}`,
            ...usage
          }
        }));
      } catch (e) {
        console.error("DynamoDB write failed:", e);
      }
    }

    // Return successful response
    return {
          statusCode: 200,
          headers: defaultHeaders,
          body: JSON.stringify({
            message: result.text, // Directly return the LLM response text
            provider: result.provider,
            model: result.model,
            usage
          })
        };

  } catch (err) {
    console.error("Top-level Lambda error:", err);
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({
        error: "Internal server error during LLM routing or execution.",
        detail: err.message 
      })
    };
  }
};