import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.find();

    // Enviar una respuesta al cliente
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al obtener los usuarios' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { DPI } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findOne({DPI: DPI});
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al obtener el usuario' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      CorreoElectronico,
      Clave,
      Nombres,
      Apellidos,
      FechaNacimiento,
      DireccionEntrega,
      NIT,
      NumeroTelefonico
    } = req.body;

    const { DPI } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findOne({DPI: DPI});
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el correo electrónico y la contraseña del usuario
    if (CorreoElectronico) user.CorreoElectronico = CorreoElectronico;
    if (Clave) user.Clave = await bcrypt.hash(Clave, 10);
    if (Nombres) user.Nombres = Nombres;
    if (Apellidos) user.Apellidos = Apellidos;
    if (FechaNacimiento) user.FechaNacimiento = new Date(FechaNacimiento);
    if (DireccionEntrega) user.DireccionEntrega = DireccionEntrega;
    if (NIT) user.NIT = NIT;
    if (NumeroTelefonico) user.NumeroTelefonico = NumeroTelefonico;
    if (DPI) user.DPI = DPI;

    await user.save();

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al actualizar el usuario' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { DPI } = req.params;

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findOne({DPI: DPI});
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar el usuario de la base de datos
    await user.deleteOne({DPI: DPI})

    // Enviar una respuesta al cliente
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al eliminar el usuario' });
  }
};
