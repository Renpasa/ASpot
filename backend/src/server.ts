import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './db';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully.');

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Stop server gracefully after test
    setTimeout(() => {
        server.close();
        prisma.$disconnect();
    }, 2000);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
