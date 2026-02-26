# Quick Deployment Guide

## Prerequisites

- Node.js 16+ installed on VPS
- SSH access to VPS as `vtl` user
- Service directory exists: `/home/vtl/vtl/email-service`

## Quick Deploy (10 seconds)

1. **Copy files to VPS:**
   ```bash
   scp -r /path/to/vtl/email-service vtl@your-vps:/home/vtl/vtl/
   ```

2. **Run deployment script:**
   ```bash
   ssh vtl@your-vps "cd /home/vtl/vtl/email-service && chmod +x deploy-email-service.sh && ./deploy-email-service.sh"
   ```

3. **Test the service:**
   ```bash
   curl http://localhost:3000/health
   ```

## Basic Usage

### Add Email
```bash
curl -X POST http://your-vps:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "site": "mysite.com"}'
```

### Get Emails
```bash
curl http://your-vps:3000/api/waitlist?site=mysite.com
```

### Export CSV
```bash
curl "http://your-vps:3000/api/waitlist?site=mysite.com&export=true" -o emails.csv
```

## Service Management

```bash
# View logs
sudo journalctl -u vtl-email-service -f

# Restart
sudo systemctl restart vtl-email-service

# Status
sudo systemctl status vtl-email-service
```

## Local Development

```bash
# Install dependencies
npm install

# Run locally
npm start

# Open test page in browser
open test.html
```

## Troubleshooting

```bash
# Check service logs
sudo journalctl -u vtl-email-service -n 50

# Test port
sudo lsof -i :3000

# Restart service if stuck
sudo systemctl restart vtl-email-service
```

For detailed documentation, see [README.md](README.md)
