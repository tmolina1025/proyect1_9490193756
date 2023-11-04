import express from 'express';
import { addCarrito, getCarrito, updateProductoCarrito, deleteProductoCarrito } from '../controllers/carritoController.js';
import authenticateToken from '../middlewares/authenticateToken.js';
const router = express.Router();

// Rutas para registrarse e iniciar sesión
router.post('/carrito', authenticateToken, addCarrito);
router.get('/carrito/:ID', authenticateToken, getCarrito);
router.put('/carrito/detalle/:ID', authenticateToken, updateProductoCarrito);
router.delete('/carrito/detalle/:ID', authenticateToken, deleteProductoCarrito);

export default router;
