#!/bin/bash

set -e

# ==========================================
# Blue-Green Deployment Script
# ==========================================

BLUE_PORT=6000
GREEN_PORT=6001

BLUE_CONTAINER="blue-test"
GREEN_CONTAINER="green-test"

IMAGE_NAME="blue-green-backend"
VERSION="${1:-2.0.0}"

NGINX_CONFIG="/etc/nginx/sites-available/default"

echo "=========================================="
echo " BLUE-GREEN DEPLOYMMENT"
echo "=========================================="
echo "version: $VERSION"
echo "=========================================="

# ------------------------------------------
# Detect current active environment
# ------------------------------------------

CURRENT_UPSTREAM=$(sudo grep -oP 'proxy_pass http://127\.0\.0\.1:\K[0-9]+' "$NGINX_CONFIG")

if [ "$CURRENT_UPSTREAM" = "$BLUE_PORT" ]; then
	ACTIVE="BLUE"
	TARGET="GREEN"
	TARGET_PORT=$GREEN_PORT
	TARGET_CONTAINER=$GREEN_CONTAINER
else
	ACTIVE="GREEN"
	TARGET="BLUE"
	TARGET_PORT=$BLUE_PORT
	TARGET_CONTAINER=$BLUE_CONTAINER
fi

echo "Current Active Environment : $ACTIVE"
echo "Target Environment 	: $TARGET"
echo "Target Port 		: $TARGET_PORT"

# ------------------------------------------
# Check target container
# ------------------------------------------

echo ""
echo "Checking Target Container..."
if docker ps -a --format '{{.Names}}' | grep -q "^${TARGET_CONTAINER}$"; then
	echo "Removing old $TARGET_CONTAINER container..."
	docker rm -f "$TARGET_CONTAINER"
fi

# ------------------------------------------
# Start new target container
# ------------------------------------------

echo ""
echo "Starting $TARGET container..."
docker run -d \
	--name "$TARGET_CONTAINER" \
	-p $TARGET_PORT:5000 \
	-e ENVIRONMENT="$TARGET" \
	-e VERSION="$VERSION" \
	"$IMAGE_NAME:$VERSION"

# ------------------------------------------
# Health Check
# ------------------------------------------

echo ""
echo "Waiting for application..."

sleep 3

echo "Running Health Check"

HEALTH_URL="http://127.0.0.1:$TARGET_PORT/health"

if curl -fsS "$HEALTH_URL" > /tmp/blue-green-health.json; then
	echo "Health Check Successful!"
	cat /tmp/blue-green-health.json
else
	echo "ERROR: Health check failed!"
	echo "Deployment aborted."
	docker logs "$TARGET_CONTAINER"
	exit 1
fi

# ------------------------------------------
# Switch Nginx traffic
# ------------------------------------------

echo ""
echo "switching traffic from $ACTIVE to $TARGET..."

sudo sed -i "s#proxy_pass http://127.0.0.1:[0-9]*;#proxy_pass http://127.0.0.1:$TARGET_PORT;#g" "$NGINX_CONFIG"
sudo sed -i "s#proxy_pass http://127.0.0.1:[0-9]*;#proxy_pass http://127.0.0.1:$TARGET_PORT;#g" "$NGINX_CONFIG"
 
# ------------------------------------------
# Validate Nginx
# ------------------------------------------

echo ""
echo "Testing Nginx configuration..."

if sudo nginx -t; then
	echo "Nginx configuration is valid."
else
	echo "ERROR: Nginx configuration failed."
	exit 1
fi

# ------------------------------------------
# Reload Nginx
# ------------------------------------------

echo ""
echo "Reloading Nginx..."

sudo systemctl reload nginx

# ------------------------------------------
# Final verification
# ------------------------------------------

echo ""
echo "Verifying deployment..."

sleep 2

FINAL_RESPONSE=$(curl -fsS http://127.0.0.1/health)

echo "$FINAL_RESPONSE"

echo ""
echo "=========================================="
echo "Deployment Successful!"
echo "=========================================="
echo "Active Environment  : $TARGET"
echo "Version             : $VERSION"
echo "port                : $TARGET_PORT"
echo "=========================================="

