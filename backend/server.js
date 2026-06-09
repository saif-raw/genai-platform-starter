#!/usr/bin/env node
/**
 * Standalone GenAI Platform Backend
 * 
 * This is a simple Express.js server that:
 * - Provides admin APIs for metrics
 * - Stores session data in a JSON file (or in-memory)
 * - Can be deployed to free services (Vercel, Netlify, Replit)
 * - Works with the React frontend on GitHub Pages
 * 
 * Usage:
 *   node server.js              # Run locally on port 3000
 *   PORT=5000 node server.js    # Run on custom port
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (or file-based for persistence)
let sessions = [];
const sessionsFile = path.join(__dirname, 'sessions.json');

// Load existing sessions from file on startup
function loadSessions() {
  try {
    if (fs.existsSync(sessionsFile)) {
      const data = fs.readFileSync(sessionsFile, 'utf-8');
      sessions = JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not load sessions file:', err.message);
    sessions = [];
  }
}

// Save sessions to file
function saveSessions() {
  try {
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
  } catch (err) {
    console.warn('Could not save sessions file:', err.message);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'GenAI Platform Backend is running' });
});

// API: Store a new session/usage entry
app.post('/api/sessions', (req, res) => {
  try {
    const { prompt, userId, projectId, model, provider, response, latencyMs, inputTokens, outputTokens, totalTokens } = req.body;

    if (!prompt || !response) {
      return res.status(400).json({ error: 'Missing required fields: prompt, response' });
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      prompt,
      userId: userId || 'anonymous',
      projectId: projectId || 'default',
      result: {
        model: model || 'unknown',
        provider: provider || 'groq',
        text: response
      },
      usage: {
        inputTokens: inputTokens || 0,
        outputTokens: outputTokens || 0,
        totalTokens: totalTokens || 0,
        latencyMs: latencyMs || 0
      }
    };

    sessions.unshift(entry); // Add to front
    sessions = sessions.slice(0, 500); // Keep only last 500
    saveSessions();

    res.json({ success: true, session: entry });
  } catch (err) {
    console.error('Error storing session:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Get admin usage stats
app.get('/api/admin/usage', (req, res) => {
  try {
    const limit = parseInt(req.query.limit || 50, 10);
    const usage = sessions.slice(0, Math.min(limit, 500));

    // Compute aggregate stats
    const stats = {
      totalRequests: sessions.length,
      totalTokensUsed: sessions.reduce((sum, s) => sum + (s.usage?.totalTokens || 0), 0),
      avgLatencyMs: sessions.length > 0 
        ? Math.round(sessions.reduce((sum, s) => sum + (s.usage?.latencyMs || 0), 0) / sessions.length)
        : 0,
      recentSessions: usage
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching usage:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Clear all sessions (admin only - in production, add authentication)
app.delete('/api/admin/sessions', (req, res) => {
  try {
    // In production, verify admin token here
    sessions = [];
    saveSessions();
    res.json({ success: true, message: 'All sessions cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve README
app.get('/', (req, res) => {
  res.json({
    name: 'GenAI Platform Backend',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Health check',
      'GET /api/admin/usage?limit=50': 'Get usage statistics',
      'POST /api/sessions': 'Store a new session/usage entry',
      'DELETE /api/admin/sessions': 'Clear all sessions (admin only)'
    },
    instructions: {
      'Local Development': 'node server.js',
      'Custom Port': 'PORT=5000 node server.js',
      'Production': 'Deploy to Vercel, Netlify, or any Node.js hosting'
    }
  });
});

// Load sessions on startup
loadSessions();

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ GenAI Platform Backend running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📊 Admin API: http://localhost:${PORT}/api/admin/usage`);
  console.log(`🏥 Health: http://localhost:${PORT}/health\n`);
});

module.exports = app;
