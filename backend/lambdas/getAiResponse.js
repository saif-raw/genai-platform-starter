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

    // FIXED: declare path at the top
    const path = event.requestContext?.resourcePath || event.path || "";
    const region = process.env.AWS_REGION || "unknown-region";
    const now = new Date().toISOString();
    const qs = event.queryStringParameters || {};

    // CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({ ok: true })
      };
    }

    // GET /v1/hello
    if (event.httpMethod === "GET" && path.endsWith("/hello")) {
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({
          ok: true,
          message: "GenAI endpoint active. POST JSON { prompt, userId, projectId }"
        })
      };
    }

    // parse JSON body
    let body = {};
    if (event.body) {
      try { body = JSON.parse(event.body); }
      catch { body = { rawBody: event.body }; }
    }

    // health check: GET /v1/hello?ping=1
    if ((event.httpMethod === "GET" && qs.ping === "1") ||
        path.endsWith("/ping")) {
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({ ok: true, type: "ping", timestamp: now })
      };
    }

    const payload = {
      provider: qs.provider || body.provider || process.env.DEFAULT_PROVIDER || "fallback",
      model: qs.model || body.model || process.env.DEFAULT_MODEL || "default-model",
      prompt: body.prompt || qs.prompt || "Okay AAAAAAAAAAAAAHHHHHHHHHHHHHH!",
      userId: body.userId || qs.userId || "KABIRA",
      projectId: body.projectId || qs.projectId || "default-project"
    };

    const { result, usage } = await route({ payload });

    // write usage
    if (process.env.USAGE_TABLE_NAME && ddb) {
      try {
        await ddb.send(
          new PutCommand({
            TableName: process.env.USAGE_TABLE_NAME,
            Item: {
              id: `${usage.timestamp}#${Math.random().toString(36).slice(2, 8)}`,
              ...usage
            }
          })
        );
      } catch (err) {
        console.error("DDB write error:", err);
      }
    }

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        message: `Routed to ${result.provider} / ${result.model}`,
        timestamp: now,
        region,
        result,
        usage
      })
    };

  } catch (err) {
    console.error("Lambda error:", err);
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Internal server error", detail: err.toString() })
    };
  }
};
