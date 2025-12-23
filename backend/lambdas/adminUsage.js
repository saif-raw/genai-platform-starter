// backend/lambdas/adminUsage.js
// Admin endpoint: returns recent full sessions (prompt + response + usage)
// Dev-friendly scan implementation (OK for portfolio / demo)

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
  console.error("DynamoDB client not available:", e);
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({ ok: true })
      };
    }

    const tableName = process.env.SESSIONS_TABLE_NAME;
    const limit = event.queryStringParameters?.limit
      ? parseInt(event.queryStringParameters.limit, 10)
      : 50;

    if (!tableName || !ddb) {
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({ usage: [] })
      };
    }

    // Dev-mode scan (acceptable for now)
    const command = new ScanCommand({
      TableName: tableName,
      Limit: limit
    });

    const resp = await ddb.send(command);
    const items = resp.Items || [];

    // Sort newest first
    items.sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : -1
    );

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        usage: items.slice(0, limit)
      })
    };

  } catch (err) {
    console.error("adminUsage error:", err);
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: String(err) })
    };
  }
};
