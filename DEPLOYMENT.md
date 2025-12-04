# Deployment Guide: GaragePilot on Google Cloud Platform (GCP)

This guide outlines the steps to deploy the full-stack GaragePilot application to GCP using Cloud Run for the backend and Firebase Hosting for the frontend.

### Prerequisites

- A Google Cloud Platform (GCP) project.
- [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/install) installed and authenticated.
- [Firebase CLI](https://firebase.google.com/docs/cli) installed and authenticated.
- Docker installed locally.

---

### Step 1: Set up PostgreSQL on Cloud SQL

1.  **Create a Cloud SQL Instance**:
    - Go to the Cloud SQL section in the GCP Console.
    - Create a new PostgreSQL instance. Choose a region, machine type, and set a strong password for the `postgres` user.
2.  **Create a Database**:
    - Once the instance is running, go to the "Databases" tab and create a new database (e.g., `garagepilot_db`).
3.  **Run the Schema**:
    - Connect to your instance using the Cloud Shell or a configured local `psql` client.
    - Execute the `server/src/db/schema.sql` file to create the necessary tables.

---

### Step 2: Configure Secret Manager

Never hardcode secrets. Store them securely in Secret Manager.

1.  Go to the Secret Manager section in the GCP Console.
2.  Create the following secrets:
    - `GEMINI_API_KEY`: Your Google Gemini API key.
    - `DB_USER`: Your Cloud SQL database user.
    - `DB_PASSWORD`: Your Cloud SQL database password.
    - `DB_DATABASE`: The name of your Cloud SQL database.
    - `DB_HOST`: The private IP address of your Cloud SQL instance.
    - `DB_PORT`: The port for your Cloud SQL instance (usually `5432`).
    *Note: For Cloud Run to connect to Cloud SQL, you will also need to set up a VPC Connector.*

---

### Step 3: Containerize and Deploy the Backend to Cloud Run

1.  **Create a `Dockerfile`** in the `server/` directory (see provided `server/Dockerfile`).
2.  **Enable GCP Services**: Make sure Artifact Registry, Cloud Build, and Cloud Run APIs are enabled for your project.
3.  **Build the Container Image**: From the project's **root directory**, run:
    ```bash
    gcloud builds submit --tag gcr.io/[PROJECT_ID]/garagepilot-server ./server
    ```
    Replace `[PROJECT_ID]` with your GCP project ID. This command uses Cloud Build to build your Docker image and push it to Google Container Registry.
4.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy garagepilot-server \
      --image gcr.io/[PROJECT_ID]/garagepilot-server \
      --platform managed \
      --region [YOUR_REGION] \
      --allow-unauthenticated \
      --add-cloudsql-instances [INSTANCE_CONNECTION_NAME]
    ```
    - Replace `[PROJECT_ID]`, `[YOUR_REGION]`, and `[INSTANCE_CONNECTION_NAME]`.
    - During the deployment process, the CLI will prompt you to set up environment variables. Set them by linking to the secrets you created in Secret Manager.

---

### Step 4: Deploy the Frontend to Firebase Hosting

1.  **Initialize Firebase**: In the `client/` directory, run:
    ```bash
    firebase init hosting
    ```
    - Select your Firebase project.
    - Set the public directory to `dist`.
    - Configure as a single-page app (rewrite all URLs to `/index.html`).
2.  **Build the Client App**: In the `client/` directory, run:
    ```bash
    npm run build
    ```
3.  **Update API URL**: Before building for production, you might need to change `client/src/services/api.ts` so the `API_BASE_URL` points to your Cloud Run service URL.
4.  **Deploy to Firebase**: In the `client/` directory, run:
    ```bash
    firebase deploy --only hosting
    ```

Firebase will provide you with a URL where your frontend is now live and communicating with your backend on Cloud Run.