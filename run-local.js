#!/usr/bin/env node

/**
 * Run the email service locally for testing
 */

const { execSync } = require('child_process');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting VTL Email Service locally...');
console.log(`📡 Listening on port ${PORT}`);

// Start the server
execSync(`node server.js`, {
  stdio: 'inherit',
  cwd: __dirname
});
