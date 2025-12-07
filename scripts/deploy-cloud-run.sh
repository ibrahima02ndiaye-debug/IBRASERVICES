#!/bin/bash
# Automated Cloud Run Deployment Script for IBRA Services
# This script deploys both frontend and backend to Google Cloud Run

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}IBRA Services - Cloud Run Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="us-west1"
SERVICE_ACCOUNT="cloud-run-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No Google Cloud project selected${NC}"
    echo "Please run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "\n${YELLOW}Project:${NC} $PROJECT_ID"
echo -e "${YELLOW}Region:${NC} $REGION"

# Function to check if gcloud is installed
check_gcloud() {
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}Error: gcloud CLI not found${NC}"
        echo "Please install Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
}

# Function to enable required APIs
enable_apis() {
    echo -e "\n${YELLOW}Enabling required Google Cloud APIs...${NC}"
    gcloud services enable run.googleapis.com \
        cloudbuild.googleapis.com \
        secretmanager.googleapis.com \
        sql-component.googleapis.com \
        sqladmin.googleapis.com --project=$PROJECT_ID
    echo -e "${GREEN}✓ APIs enabled${NC}"
}

# Function to deploy backend
deploy_backend() {
    echo -e "\n${YELLOW}Deploying backend API...${NC}"
    
    cd server
    
    # Create .gcloudignore if it doesn't exist
    cat > .gcloudignore <<EOF
node_modules/
.env
.env.local
*.log
.DS_Store
EOF

    # Deploy to Cloud Run
    gcloud run deploy ibra-services-api \
        --source . \
        --region $REGION \
        --platform managed \
        --allow-unauthenticated \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 10 \
        --set-env-vars="NODE_ENV=production,PORT=8080" \
        --project=$PROJECT_ID
    
    # Get the backend URL
    BACKEND_URL=$(gcloud run services describe ibra-services-api \
        --region $REGION \
        --format="value(status.url)" \
        --project=$PROJECT_ID)
    
    echo -e "${GREEN}✓ Backend deployed successfully${NC}"
    echo -e "${YELLOW}Backend URL:${NC} $BACKEND_URL"
    
    cd ..
    
    # Export for frontend deployment
    export VITE_API_URL=$BACKEND_URL
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "\n${YELLOW}Deploying frontend...${NC}"
    
    cd client
    
    # Install dependencies and build
    echo "Building frontend..."
    npm install --legacy-peer-deps
    VITE_API_URL=$VITE_API_URL npm run build
    
    # Create a simple Node.js server to serve the built files
    cat > server.js <<'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

    # Create package.json for the server
    cat > package-server.json <<EOF
{
  "name": "ibra-services-frontend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

    # Create Dockerfile for frontend
    cat > Dockerfile <<'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy built files
COPY dist ./dist
COPY server.js .
COPY package-server.json ./package.json

# Install production dependencies
RUN npm install --production

EXPOSE 8080

CMD ["npm", "start"]
EOF

    # Deploy to Cloud Run
    gcloud run deploy ibra-services-web \
        --source . \
        --region $REGION \
        --platform managed \
        --allow-unauthenticated \
        --memory 256Mi \
        --cpu 1 \
        --max-instances 10 \
        --set-env-vars="VITE_API_URL=$VITE_API_URL" \
        --project=$PROJECT_ID
    
    FRONTEND_URL=$(gcloud run services describe ibra-services-web \
        --region $REGION \
        --format="value(status.url)" \
        --project=$PROJECT_ID)
    
    echo -e "${GREEN}✓ Frontend deployed successfully${NC}"
    echo -e "${YELLOW}Frontend URL:${NC} $FRONTEND_URL"
    
    cd ..
}

# Main deployment flow
main() {
    check_gcloud
    
    echo -e "\n${YELLOW}Do you want to enable required APIs? (y/n)${NC}"
    read -r enable_apis_choice
    if [ "$enable_apis_choice" = "y" ]; then
        enable_apis
    fi
    
    echo -e "\n${YELLOW}Deploy backend? (y/n)${NC}"
    read -r deploy_backend_choice
    if [ "$deploy_backend_choice" = "y" ]; then
        deploy_backend
    fi
    
    echo -e "\n${YELLOW}Deploy frontend? (y/n)${NC}"
    read -r deploy_frontend_choice
    if [ "$deploy_frontend_choice" = "y" ]; then
        deploy_frontend
    fi
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "\n${YELLOW}Your application is now live:${NC}"
    echo -e "${YELLOW}Frontend:${NC} $FRONTEND_URL"
    echo -e "${YELLOW}Backend API:${NC} $BACKEND_URL"
    echo -e "\n${YELLOW}Next steps:${NC}"
    echo "1. Set up environment variables in Secret Manager"
    echo "2. Configure your database connection"
    echo "3. Set up custom domain (optional)"
    echo -e "\n${YELLOW}Monitor logs:${NC}"
    echo "Backend:  gcloud run logs read ibra-services-api --region=$REGION"
    echo "Frontend: gcloud run logs read ibra-services-web --region=$REGION"
}

main
