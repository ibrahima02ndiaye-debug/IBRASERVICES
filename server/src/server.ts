import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import clientRoutes from './routes/clients';
import vehicleRoutes from './routes/vehicles';
import aiRoutes from './routes/ai';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('GaragePilot API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});