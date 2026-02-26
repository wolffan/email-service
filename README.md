# VTL Email Service

A standalone email/waitlist collection service that can be used across multiple websites. Built with Node.js, Express, and SQLite.

## Features

- ✅ Multi-site support with site identifier
- ✅ Email validation
- ✅ Simple SQLite database (no external dependencies)
- ✅ CORS support for multiple domains
- ✅ Export emails as CSV
- ✅ RESTful API
- ✅ Systemd service for auto-start
- ✅ Built-in logging

## Installation & Deployment

### 1. Copy files to VPS

```bash
# Copy the email-service directory to the VPS
scp -r vtl/email-service vtl@your-vps:/home/vtl/vtl/
```

### 2. Run deployment script

```bash
# SSH into your VPS
ssh vtl@your-vps

# Run the deployment script
chmod +x /home/vtl/vtl/email-service/deploy-email-service.sh
./deploy-email-service.sh
```

Or deploy manually:

```bash
# Create service directory
sudo mkdir -p /home/vtl/vtl/email-service
sudo chown -R vtl:vtl /home/vtl/vtl/email-service

# Create systemd service file
sudo tee /etc/systemd/system/vtl-email-service.service > /dev/null <<EOF
[Unit]
Description=VTL Email Service
After=network.target

[Service]
Type=simple
User=vtl
Group=vtl
WorkingDirectory=/home/vtl/vtl/email-service
Environment=PORT=3000
ExecStart=/usr/bin/node /home/vtl/vtl/email-service/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable vtl-email-service
sudo systemctl start vtl-email-service
```

### 3. Check service status

```bash
# Check if service is running
sudo systemctl status vtl-email-service

# View logs
sudo journalctl -u vtl-email-service -f

# Test health endpoint
curl http://localhost:3000/health
```

## API Documentation

The service runs on port 3000 by default.

### Health Check

**GET** `/health`

Returns service status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-26T08:00:00.000Z",
  "database": "connected"
}
```

---

### Add Email to Waitlist

**POST** `/api/waitlist`

Adds an email to the waitlist for a specific site.

**Request Body:**
```json
{
  "email": "user@example.com",
  "site": "mywebsite.com"
}
```

**Success Response (201):**
```json
{
  "message": "Email added successfully",
  "id": 1
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields or invalid email format
- `500 Internal Server Error` - Database error

**Validation Rules:**
- `email` is required and must be a valid email format
- `site` is required and must be a non-empty string

---

### Get Emails for Site

**GET** `/api/waitlist?site=xxx`

Returns all emails for a specific site.

**Query Parameters:**
- `site` (required) - Site identifier

**Success Response (200):**
```json
{
  "site": "mywebsite.com",
  "count": 5,
  "emails": [
    {
      "id": 1,
      "email": "user1@example.com",
      "site": "mywebsite.com",
      "created_at": "2026-02-26T08:00:00.000Z"
    },
    {
      "id": 2,
      "email": "user2@example.com",
      "site": "mywebsite.com",
      "created_at": "2026-02-26T08:00:01.000Z"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Site parameter missing

---

### Export Emails as CSV

**GET** `/api/waitlist?site=xxx&export=true`

Exports all emails for a specific site as a CSV file.

**Query Parameters:**
- `site` (required) - Site identifier
- `export` (required, set to "true") - Export mode

**Response:**
Returns CSV file with headers: `id,email,site,created_at`

Example:
```csv
id,email,site,created_at
1,user@example.com,mywebsite.com,2026-02-26T08:00:00.000Z
2,another@example.com,mywebsite.com,2026-02-26T08:00:01.000Z
```

**Error Responses:**
- `400 Bad Request` - Site parameter missing

---

## CORS Configuration

To allow requests from multiple domains, update the CORS configuration in `server.js`:

```javascript
const corsOptions = {
  origin: ['https://site1.com', 'https://site2.com', 'http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
```

---

## Database

The service uses SQLite for data storage. The database file is located at:

```
/home/vtl/vtl/email-service/waitlist.db
```

### Database Schema

```sql
CREATE TABLE waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  site TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Backup Database

```bash
# Backup the database
cp /home/vtl/vtl/email-service/waitlist.db /home/vtl/vtl/email-service/waitlist_backup_$(date +%Y%m%d).db

# Restore from backup
cp /home/vtl/vtl/email-service/waitlist_backup_20260226.db /home/vtl/vtl/email-service/waitlist.db
```

---

## Usage Examples

### Using cURL

```bash
# Add email
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "site": "mysite.com"}'

# Get emails for site
curl http://localhost:3000/api/waitlist?site=mysite.com

# Export to CSV
curl "http://localhost:3000/api/waitlist?site=mysite.com&export=true" \
  -o emails.csv
```

### Using JavaScript/Fetch

```javascript
// Add email
const response = await fetch('http://your-vps-ip:3000/api/waitlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    site: 'mywebsite.com'
  })
});

// Get emails for site
const response = await fetch('http://your-vps-ip:3000/api/waitlist?site=mywebsite.com');

// Export to CSV
const response = await fetch('http://your-vps-ip:3000/api/waitlist?site=mywebsite.com&export=true');
const csv = await response.text();
```

### Using HTML Form

```html
<form action="http://your-vps-ip:3000/api/waitlist" method="POST">
  <input type="email" name="email" placeholder="Enter your email" required>
  <input type="text" name="site" value="mywebsite.com" hidden>
  <button type="submit">Join Waitlist</button>
</form>
```

---

## Managing the Service

```bash
# Start service
sudo systemctl start vtl-email-service

# Stop service
sudo systemctl stop vtl-email-service

# Restart service
sudo systemctl restart vtl-email-service

# Check status
sudo systemctl status vtl-email-service

# View logs
sudo journalctl -u vtl-email-service -f

# View last 100 lines
sudo journalctl -u vtl-email-service -n 100

# Disable service (doesn't start on boot)
sudo systemctl disable vtl-email-service
```

---

## Port Configuration

Change the port by setting the `PORT` environment variable:

```bash
# Set port to 8080
export PORT=8080
sudo systemctl restart vtl-email-service
```

Or in the systemd service file:

```ini
[Service]
Environment=PORT=8080
```

---

## Troubleshooting

### Service won't start

```bash
# Check logs
sudo journalctl -u vtl-email-service

# Check if port is already in use
sudo lsof -i :3000

# Test node installation
node --version
```

### Database errors

```bash
# Check database file permissions
ls -la /home/vtl/vtl/email-service/waitlist.db

# Fix permissions if needed
sudo chown vtl:vtl /home/vtl/vtl/email-service/waitlist.db
```

### CORS errors

Make sure CORS is configured correctly for your domains in `server.js`.

---

## Security Considerations

- ✅ Email validation prevents invalid submissions
- ✅ SQLite database is local and doesn't require external services
- ✅ CORS restricts which domains can access the API
- ✅ No authentication by default (add if needed)
- ✅ Use HTTPS in production with a reverse proxy like Nginx

### Adding Basic Authentication (Optional)

Add authentication middleware to protect your API:

```javascript
const basicAuth = require('express-basic-auth');

app.use(basicAuth({
  users: { 'admin': 'your_password' }
}));
```

---

## License

MIT
