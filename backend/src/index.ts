import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createApp } from './app';

dotenv.config();

const prisma = new PrismaClient();
const app = createApp(prisma);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});