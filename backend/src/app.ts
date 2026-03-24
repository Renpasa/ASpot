import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import spotRoutes from './routes/spot.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/spots', spotRoutes);

export default app;
