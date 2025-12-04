# GaragePilot - Frontend Client

This is the frontend application for GaragePilot, built with React and Vite.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript

## 📂 Project Structure

- `src/components/`: Reusable React components, organized by feature.
- `src/contexts/`: React Context for global state management (e.g., user role, theme).
- `src/services/`: Modules for interacting with the backend API.
- `src/types.ts`: TypeScript type definitions shared across the app.
- `src/utils/`: Utility functions (e.g., PDF generation).

## 📡 API Communication

The client does not interact with external services directly. All API calls (e.g., fetching data, calling the Gemini API) are made to our own backend server.

During development, Vite is configured with a proxy in `vite.config.ts`. Any request made to `/api` from the client will be forwarded to the backend server running on `http://localhost:3001`, avoiding CORS issues.

In production, the API base URL should be configured to point to the deployed backend service's URL.

## 📜 Available Scripts

In the `client/` directory, you can run the following commands:

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the app for production into the `dist` folder.
- `npm run preview`: Serves the production build locally for testing.