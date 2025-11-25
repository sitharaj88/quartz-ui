#!/usr/bin/env node

/**
 * Local server to test GitHub Pages deployment
 * Serves the dist folder at /quartz-ui/ to simulate GitHub Pages
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BASE_PATH = '/quartz-ui';
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Remove base path if present
  let filePath = req.url;
  if (filePath.startsWith(BASE_PATH)) {
    filePath = filePath.substring(BASE_PATH.length);
  }

  // Default to index.html for directory requests
  if (filePath === '/' || filePath === '') {
    filePath = '/index.html';
  }

  // Remove query string
  filePath = filePath.split('?')[0];

  // Build full file path
  const fullPath = path.join(DIST_DIR, filePath);

  // Check if file exists
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Try with .html extension
      const htmlPath = fullPath + '.html';
      fs.access(htmlPath, fs.constants.F_OK, (htmlErr) => {
        if (htmlErr) {
          // For SPA routing, serve index.html for all non-existent routes
          const indexPath = path.join(DIST_DIR, 'index.html');
          console.log(`  → Serving index.html (SPA fallback)`);
          serveFile(indexPath, res);
          return;
        }
        serveFile(htmlPath, res);
      });
      return;
    }

    serveFile(fullPath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

server.listen(PORT, () => {
  console.log(`\n🚀 Local GitHub Pages server running!`);
  console.log(`\n   URL: http://localhost:${PORT}`);
  console.log(`\n   This simulates how your site works on GitHub Pages.\n`);
  console.log(`Press Ctrl+C to stop.\n`);
});
