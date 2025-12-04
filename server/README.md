# GaragePilot - Backend Server

This is the backend API server for GaragePilot, built with Node.js, Express, and PostgreSQL.

## 🛠️ Tech Stack

- **Framework**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Language**: TypeScript
- **Key Libraries**:
    - `pg`: Node.js client for PostgreSQL.
    - `@google/genai`: Official SDK for the Google Gemini API.
    - `cors`: For enabling Cross-Origin Resource Sharing.
    - `dotenv`: For managing environment variables.

## 📂 API Structure

The API follows a standard Model-View-Controller (MVC) like pattern:

- `src/routes/`: Defines the API endpoints (e.g., `/api/clients`). Each router file maps HTTP methods to controller functions.
- `src/controllers/`: Contains the business logic for each route. Controllers handle incoming requests, interact with the database, and send back responses.
- `src/db/`: Manages the database connection (`index.ts`) and schema definition (`schema.sql`).

### Secure API Handling

**Crucially, the `GEMINI_API_KEY` is only used and stored on the server.** The client communicates with our API, which then securely makes requests to the Gemini API. This prevents the secret key from ever being exposed in the browser.

## ⚙️ Configuration

Create a `.env` file in the `server/` root based on `.env.example`. It requires the following variables:

- `DB_USER`: Your PostgreSQL username.
- `DB_HOST`: Database host (e.g., `localhost`).
- `DB_DATABASE`: The name of your database.
- `DB_PASSWORD`: Your PostgreSQL password.
- `DB_PORT`: Port for the PostgreSQL server (default: `5432`).
- `PORT`: Port for the Express server (default: `3001`).
- `GEMINI_API_KEY`: Your Google Gemini API key.

## 📜 Available Scripts

In the `server/` directory, you can run the following commands:

- `npm run dev`: Starts the server in development mode using `nodemon` for automatic restarts on file changes.
- `npm run build`: Compiles the TypeScript code into JavaScript in the `dist` folder.
- `npm run start`: Runs the compiled JavaScript code from the `dist` folder. This is intended for production.