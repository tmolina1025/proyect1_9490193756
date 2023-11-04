// app.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import carritoRoutes from './routes/carritoRoutes.js';
import compraRoutes from './routes/compraRoutes.js';
import cors from 'cors'

const app = express();

app.use(cors());

// Configurar middlewares
app.use(express.json());

// Configurar rutas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productoRoutes);
app.use('/api', carritoRoutes);
app.use('/api', compraRoutes);

export default app 