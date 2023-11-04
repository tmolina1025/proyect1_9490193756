// src/routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Rutas para registrarse e iniciar sesión
router.post('/registro/:DPI', register);
router.post('/login', login);

export default router;
