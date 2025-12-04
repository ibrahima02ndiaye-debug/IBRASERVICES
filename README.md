# GaragePilot - AI-Powered Garage Management

GaragePilot is a full-stack, AI-powered dashboard designed to streamline operations for modern auto garages. It features a dual-role interface for both garage staff and clients, with modules for managing clients, vehicles, appointments, inventory, and finances.

## ✨ Features

- **Dual-Role Interface**: Separate, tailored views for Garage staff and their Clients.
- **AI Vehicle Diagnostics**: Upload symptoms and images to get an AI-powered diagnosis.
- **AI Predictive Maintenance**: Analyzes vehicle history to predict future service needs.
- **Comprehensive Management**: Modules for clients, vehicles, appointments, personnel, partners, and accounting.
- **Inventory Tracking**: Manage parts, track stock levels, and get low-stock alerts.
- **Client Portal**: Clients can view their vehicles, appointments, and approve quotes.
- **Real-time Messaging**: Direct messaging between the garage and clients, with an SOS feature.
- **AI Chat Assistant**: An integrated chatbot for quick questions and assistance.

## 🏛️ Architecture

This project is structured as a **monorepo** containing two main packages:

- `client/`: A modern frontend application built with **React** and **Vite**.
- `server/`: A robust backend API built with **Node.js**, **Express**, and **PostgreSQL**.

All calls to the Google Gemini API are handled securely by the backend, ensuring API keys are never exposed to the client.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) running locally or accessible.

### 1. Installation

Clone the repository and install all dependencies for both the client and server from the root directory:

```bash
git clone <repository-url>
cd garage-pilot-fullstack
npm run install-all
```

### 2. Configuration

You need to set up environment variables for the server.

1.  Navigate to the `server` directory.
2.  Copy the example environment file:
    ```bash
    cd server
    cp .env.example .env
    ```
3.  Edit the `.env` file with your specific credentials:
    - `DB_*`: Your PostgreSQL connection details.
    - `GEMINI_API_KEY`: Your Google Gemini API key.
    - `PORT`: The port for the server to run on (defaults to 3001).

### 3. Database Setup

1.  Make sure your PostgreSQL server is running.
2.  Create a database with the name you specified in `server/.env`.
3.  Execute the schema script to create all necessary tables. You can use a tool like `psql`:
    ```bash
    psql -U <your_db_user> -d <your_db_name> -f src/db/schema.sql
    ```

### 4. Running the Application

Run the client and server concurrently from the **root directory**:

```bash
npm run dev
```

This will start:
- The React client on `http://localhost:5173` (or another port if 5173 is busy).
- The Node.js server on `http://localhost:3001` (or the port you configured).

The client is configured to proxy API requests to the server, so you can interact with the app seamlessly from the client URL.

## ☁️ Deployment

For instructions on deploying this application to a production environment like Google Cloud Platform, see [DEPLOYMENT.md](./DEPLOYMENT.md).