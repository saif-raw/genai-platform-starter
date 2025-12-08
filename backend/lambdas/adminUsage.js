// backend/lambdas/adminUsage.js
// Admin endpoint: returns recent usage items from DynamoDB (if available)
// NOTE: for now it returns last N items using a scan (dev only).
// Remember to secure this in production (API Key or Cognito).

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET"
};

let ddb;
try {
  const client = new DynamoDBClient({});
  ddb = DynamoDBDocumentClient.from(client);
} catch (e) {
  ddb = null;
  console.log("DynamoDB client not available:", e);
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: defaultHeaders, body: JSON.stringify({ ok: true }) };
    }

    const tableName = process.env.USAGE_TABLE_NAME;
    const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit, 10) : 50;

    if (!tableName || !ddb) {
      // Return dummy data if table not configured
      const demo = Array.from({ length: Math.min(5, limit) }).map((_, i) => ({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        provider: "none",
        model: "none",
        tokens: Math.floor(Math.random() * 10) + 1,
        userId: "demo-user",
        projectId: "demo-project",
        prompt_snippet: "demo prompt snippet"
      }));
      return { statusCode: 200, headers: defaultHeaders, body: JSON.stringify({ usage: demo }) };
    }

    // Scan table (dev). For production use Query on GSI or proper ranges.
    const command = new ScanCommand({ TableName: tableName, Limit: limit });
    const resp = await ddb.send(command);
    const items = resp.Items || [];
    // sort descending by timestamp where possible
    items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    return { statusCode: 200, headers: defaultHeaders, body: JSON.stringify({ usage: items.slice(0, limit) }) };

  } catch (err) {
    console.error("adminUsage error:", err);
    return { statusCode: 500, headers: defaultHeaders, body: JSON.stringify({ error: String(err) }) };
  }
};
