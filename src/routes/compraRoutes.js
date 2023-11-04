import express from 'express';
import { addCompra } from '../controllers/compraController.js';
import authenticateToken from '../middlewares/authenticateToken.js';
const router = express.Router();

// Rutas para registrarse e iniciar sesión
router.post('/compra', authenticateToken, addCompra);

export default router;
