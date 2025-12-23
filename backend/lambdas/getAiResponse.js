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

    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: defaultHeaders, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "GET" && path.endsWith("/hello")) {
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({ ok: true, message: "GenAI endpoint active" })
      };
    }

    let body = {};
    let rawBody = event.body;

    if (rawBody) {
      if (event.isBase64Encoded) {
        rawBody = Buffer.from(rawBody, "base64").toString("utf-8");
      }
      body = JSON.parse(rawBody);
      if (typeof body === "string") body = JSON.parse(body);
    }

    const payload = {
      provider: body.provider || qs.provider || process.env.DEFAULT_PROVIDER,
      model: body.model || qs.model || process.env.DEFAULT_MODEL,
      prompt: body.prompt || qs.prompt || "Hello!",
      userId: body.userId || qs.userId || "anonymous",
      projectId: body.projectId || qs.projectId || "default-project"
    };

    const { result, usage } = await route({ payload });

    /* ---------------- NEW: Persist Session ---------------- */

    if (process.env.SESSIONS_TABLE_NAME && ddb) {
      try {
        await ddb.send(new PutCommand({
          TableName: process.env.SESSIONS_TABLE_NAME,
          Item: {
            sessionId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            timestamp: new Date().toISOString(),
            userId: payload.userId,
            projectId: payload.projectId,
            provider: result.provider,
            model: result.model,
            prompt: payload.prompt,
            response: result.text,
            latencyMs: usage.latencyMs,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            totalTokens: usage.totalTokens
          }
        }));
      } catch (e) {
        console.error("Session persistence failed:", e);
      }
    }

    /* ---------------- Existing Usage Write (unchanged) ---------------- */

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
        console.error("Usage write failed:", e);
      }
    }

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        message: result.text,
        provider: result.provider,
        model: result.model,
        usage
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};
