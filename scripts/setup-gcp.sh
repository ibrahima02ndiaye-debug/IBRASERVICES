#!/bin/bash
# One-time setup script for Google Cloud Platform
# Run this before your first deployment

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"  
echo -e "${GREEN}IBRA Services - GCP Initial Setup${NC}"
echo -e "${GREEN}========================================${NC}"

PROJECT_ID=$(gcloud config get-value project)
REGION="us-west1"
DB_INSTANCE_NAME="ibra-db"

if [ -z "$PROJECT_ID" ]; then
    echo "Error: No project selected"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "\n${YELLOW}1. Enabling required APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    --project=$PROJECT_ID

echo -e "\n${YELLOW}2. Creating Cloud SQL PostgreSQL instance...${NC}"
echo "This may take several minutes..."

gcloud sql instances create $DB_INSTANCE_NAME \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=$REGION \
    --root-password=$(openssl rand -base64 32) \
    --project=$PROJECT_ID || echo "Instance may already exist, continuing..."

echo -e "\n${YELLOW}3. Creating database...${NC}"
gcloud sql databases create garagepilot \
    --instance=$DB_INSTANCE_NAME \
    --project=$PROJECT_ID || echo "Database may already exist, continuing..."

echo -e "\n${YELLOW}4. Setting up Secret Manager...${NC}"
echo "Please enter your Gemini API key:"
read -s GEMINI_API_KEY

echo "Please enter a JWT secret (or press Enter to generate one):"
read -s JWT_SECRET_INPUT
JWT_SECRET=${JWT_SECRET_INPUT:-$(openssl rand -base64 32)}

# Create secrets
echo -n "$GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY \
    --data-file=- \
    --replication-policy="automatic" \
    --project=$PROJECT_ID || echo "Secret may already exist"

echo -n "$JWT_SECRET" | gcloud secrets create JWT_SECRET \
    --data-file=- \
    --replication-policy="automatic" \
    --project=$PROJECT_ID || echo "Secret may already exist"

echo -e "\n${GREEN}✓ Setup complete!${NC}"
echo -e "\nNext steps:"
echo "1. Run ./scripts/deploy-cloud-run.sh to deploy your application"
echo "2. Configure your database schema"
echo -e "\n${YELLOW}Database connection string:${NC}"
gcloud sql instances describe $DB_INSTANCE_NAME \
    --format="value(connectionName)" \
    --project=$PROJECT_ID
