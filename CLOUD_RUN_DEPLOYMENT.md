# Cloud Run Deployment - Automated Setup

This directory contains scripts and configuration for automated deployment to Google Cloud Run.

## Quick Deploy Script

```bash
# Run this script to deploy to Cloud Run
./scripts/deploy-cloud-run.sh
```

## What gets deployed

- **Frontend**: React application (Vite build)
- **Backend**: Node.js Express API
- **Database**: Cloud SQL PostgreSQL instance

## Prerequisites

1. Google Cloud SDK installed (`gcloud` CLI)
2. Project created in Google Cloud Console
3. Billing enabled
4. Required APIs enabled (Cloud Run, Cloud SQL, Secret Manager)

## First-Time Setup

Run the setup script:
```bash
./scripts/setup-gcp.sh
```

This will:
- Enable required Google Cloud APIs
- Create Cloud SQL PostgreSQL instance
- Set up Secret Manager for environment variables
- Configure service account permissions

## Environment Variables

Set these in Google Cloud Secret Manager:
- `GEMINI_API_KEY` - Your Google Gemini AI API key
- `JWT_SECRET` - Secret for JWT token generation
- `DB_PASSWORD` - Database password

## Manual Deployment Steps

If you prefer manual deployment:

### 1. Build and Deploy Backend

```bash
cd server
gcloud run deploy ibra-services-api \
  --source . \
  --region us-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,JWT_SECRET=JWT_SECRET:latest"
```

### 2. Build and Deploy Frontend

```bash
cd client
npm run build
gcloud run deploy ibra-services-web \
  --source . \
  --region us-west1 \
  --platform managed \
  --allow-unauthenticated
```

## Continuous Deployment

The project includes GitHub Actions workflows:
- `.github/workflows/deploy-production.yml` - Deploy on push to main branch
- `.github/workflows/deploy-staging.yml` - Deploy PR previews

## Costs

Estimated monthly costs (low traffic):
- Cloud Run: ~$0-5/month (free tier covers most)
- Cloud SQL: ~$10-15/month (db-f1-micro instance)
- Total: ~$10-20/month

## Support

For issues, check:
- Cloud Run logs: `gcloud run logs read ibra-services-api`
- Cloud SQL status: `gcloud sql instances describe ibra-db`
