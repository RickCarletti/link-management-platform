import express from 'express';
import { prisma } from './config/prisma';

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

app.get('/test-db', async (req, res) => {
  const links = await prisma.link.findMany();
  res.json(links);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
