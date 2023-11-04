import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/userModel.js';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const register = async (req, res) => {
  try {
    const {
      CorreoElectronico,
      Clave,
      ValidacionClave,
      Nombres,
      Apellidos,
      FechaNacimiento,
      DireccionEntrega,
      NIT,
      NumeroTelefonico
    } = req.body;

    const { DPI } = req.params;

    if (Clave !== ValidacionClave) {
      return res.status(400).json({ message: 'Las claves no coinciden' });
    }

    if (!passwordRegex.test(Clave)) {
      return res.status(400).json({ message: 'La contraseña no cumple con los requisitos minimos, debe tener al menos 8 caracteres, usar mayusculas, minusculas y numeros' });
    }

    if(!emailRegex.test(CorreoElectronico)){
      return res.status(400).json({ message: 'El correo electronico no tiene un formato valido' });
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ CorreoElectronico });
    if (existingUser) {
      return res.status(400).json({ message: 'Ya existe un usuario con el mismo correo electrónico' });
    }

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(Clave, 10);
    const newUser = new User({
      CorreoElectronico,
      Clave: hashedPassword,
      Nombres,
      Apellidos,
      FechaNacimiento: new Date(FechaNacimiento), // Convierte la cadena a un objeto Date
      DireccionEntrega,
      NIT,
      NumeroTelefonico,
      DPI,
      Rol: "Usuario"
    });
    await newUser.save();

    // Generar un token de acceso
    const accessToken = jwt.sign({ userId: newUser._id }, config.secretKey);

    // Enviar una respuesta al cliente
    res.status(201).json({ accessToken, DPI: DPI });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al registrar el usuario' });
  }
};


export const login = async (req, res) => {
  try {
    const { CorreoElectronico, Clave } = req.body;

    // Verificar si el correo electrónico y la contraseña son correctos
    const user = await User.findOne({ CorreoElectronico });
    if (!user) {
      return res.status(401).json({ message: 'correo electronico no registrado' });
    }

    const isPasswordValid = await bcrypt.compare(Clave, user.Clave);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar un token de acceso
    const accessToken = jwt.sign({ userId: user._id }, config.secretKey);
    // Enviar una respuesta al cliente
    res.status(200).json({ Token: accessToken, DPI: user.DPI, Rol: user.Rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al iniciar sesión' });
  }
};
