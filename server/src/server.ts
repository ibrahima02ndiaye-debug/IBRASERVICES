import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import clientRoutes from './routes/clients';
import vehicleRoutes from './routes/vehicles';
import appointmentRoutes from './routes/appointments';
import accountingRoutes from './routes/accounting';
import quoteRoutes from './routes/quotes';
import aiRoutes from './routes/ai';
import authRoutes from './routes/auth';

dotenv.config();

// Fix for __dirname in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Enable CORS - Allow all in dev, restrict in prod if needed
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files in production
if (isProduction) {
  // Assuming the client build is located at ../client/dist relative to the server src
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  // Handle SPA routing - return index.html for any unknown route
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('GaragePilot API is running in Development Mode!');
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  if (isProduction) {
    console.log('Serving static files from client/dist');
  }
});