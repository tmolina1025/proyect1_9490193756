// src/routes/userRoutes.js
import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/perfil', authenticateToken, getUsers);
router.get('/perfil/:DPI', authenticateToken, getUserById);
router.put('/perfil/:DPI', authenticateToken, updateUser);
router.delete('/perfil/:DPI', authenticateToken, deleteUser);

export default router;
