#!/bin/bash

# VTL Email Service Deployment Script
# This script sets up the email service on the VPS

set -e

# Configuration
SERVICE_NAME="vtl-email-service"
SERVICE_DIR="/home/vtl/vtl/email-service"
LOG_DIR="/var/log/vtl"

echo "🚀 Starting deployment of VTL Email Service..."

# 1. Create service directory
echo "📁 Creating service directory..."
sudo mkdir -p "$SERVICE_DIR"
sudo chown -R vtl:vtl "$SERVICE_DIR"

# 2. Copy files
echo "📋 Copying files..."
cp -r /path/to/vtl/email-service/* "$SERVICE_DIR/"

# 3. Create log directory
echo "📝 Creating log directory..."
sudo mkdir -p "$LOG_DIR"
sudo chown vtl:vtl "$LOG_DIR"

# 4. Create systemd service file
echo "⚙️  Creating systemd service..."
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null <<EOF
[Unit]
Description=VTL Email Service
After=network.target

[Service]
Type=simple
User=vtl
Group=vtl
WorkingDirectory=$SERVICE_DIR
Environment=PORT=3000
ExecStart=/usr/bin/node $SERVICE_DIR/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# 5. Create log rotation file
echo "🔄 Setting up log rotation..."
sudo tee /etc/logrotate.d/${SERVICE_NAME} > /dev/null <<EOF
/var/log/${SERVICE_NAME}/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 644 vtl vtl
}
EOF

# 6. Reload systemd
echo "🔄 Reloading systemd daemon..."
sudo systemctl daemon-reload

# 7. Enable service to start on boot
echo "🚀 Enabling service to start on boot..."
sudo systemctl enable $SERVICE_NAME

# 8. Start service
echo "▶️  Starting service..."
sudo systemctl start $SERVICE_NAME

# 9. Check service status
echo "📊 Checking service status..."
sleep 2
sudo systemctl status $SERVICE_NAME --no-pager

# 10. Test health endpoint
echo "🏥 Testing health endpoint..."
sleep 1
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Service is running successfully!"
else
    echo "❌ Service failed to start. Check logs with: sudo journalctl -u $SERVICE_NAME"
    exit 1
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Useful commands:"
echo "   View logs: sudo journalctl -u $SERVICE_NAME -f"
echo "   Restart:   sudo systemctl restart $SERVICE_NAME"
echo "   Stop:      sudo systemctl stop $SERVICE_NAME"
echo "   Status:    sudo systemctl status $SERVICE_NAME"
echo ""
