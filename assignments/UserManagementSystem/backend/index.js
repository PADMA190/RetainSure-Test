import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = 5009;

app.use(cors());
app.use(express.json());

app.use('/', userRoutes);

app.use((err, req, res, next) => {
  // Centralized error handler
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 