# VTL Email Service - File Structure

```
vtl/email-service/
├── package.json          # Node.js dependencies and scripts
├── server.js             # Main application server
├── test.html             # HTML form for testing locally
├── example.js            # JavaScript examples of API usage
├── run-local.js          # Helper script to run locally
├── deploy-email-service.sh  # Deployment script for VPS
├── vtl-email-service.service # Systemd service file
├── README.md             # Full documentation
├── DEPLOYMENT.md         # Quick deployment guide
├── .gitignore            # Git ignore rules
├── .env.example          # Environment variables template
└── waitlist.db           # SQLite database (created on first run)
```

## File Descriptions

### Core Files

- **`package.json`**
  - Defines project dependencies (express, cors, sqlite3)
  - Node scripts for running the service
  - Metadata about the project

- **`server.js`**
  - Main application logic
  - Express server setup
  - API routes and handlers
  - SQLite database operations
  - Request validation
  - CORS configuration

### Testing & Examples

- **`test.html`**
  - Interactive HTML form for testing
  - Live preview of the service
  - Auto-sends emails to local server

- **`example.js`**
  - Complete examples of API usage
  - Shows how to add, retrieve, and export emails
  - Can be run with: `node example.js`

### Deployment

- **`deploy-email-service.sh`**
  - Automated deployment script
  - Creates service directory
  - Sets up systemd service
  - Starts and tests the service

- **`vtl-email-service.service`**
  - Systemd service configuration
  - Auto-starts on boot
  - Handles restarts on failure
  - Logs to systemd journal

### Documentation

- **`README.md`**
  - Complete API documentation
  - Installation instructions
  - Usage examples
  - Troubleshooting guide
  - Security considerations

- **`DEPLOYMENT.md`**
  - Quick reference for deployment
  - Basic commands
  - Common tasks
  - Troubleshooting tips

- **`FILES.md`** (this file)
  - File structure overview
  - Quick reference guide

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run locally:**
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Test the service:**
   ```bash
   curl http://localhost:3000/health
   ```

4. **Deploy to VPS:**
   ```bash
   ./deploy-email-service.sh
   ```

## Key Features

- ✅ RESTful API with validation
- ✅ Multi-site email collection
- ✅ CSV export functionality
- ✅ SQLite database (no external dependencies)
- ✅ Systemd integration for production
- ✅ CORS support for multiple domains
- ✅ Comprehensive documentation
- ✅ Ready to deploy

## Technology Stack

- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** SQLite3
- **CORS:** cors package
- **Process Management:** Systemd
