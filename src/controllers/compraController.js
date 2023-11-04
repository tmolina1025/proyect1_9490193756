import Compra from "../models/compraModel.js";
import Carrito from "../models/carritoModel.js";
import mongoose from 'mongoose';


export const addCompra = async (req, res) => {
    try {
        const { 
            CarritoId
        } = req.body;

        var carritoBuscado = await Carrito.findById(CarritoId);
        if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        
        if(carritoBuscado.Usuario !== req.user._id.toString()){
            return res.status(404).json({ message: 'El usuario que realiza la compra no es el mismo dueño del carrito' });
        }

        const fechaCompra = new Date();

        const newCompra = new Compra({
            Carrito: CarritoId,
            Total: carritoBuscado.Total,
            Usuario: carritoBuscado.Usuario,
            FechaCompra: fechaCompra 
          });
          var compraGuardada = await newCompra.save();

        // Enviar una respuesta al cliente
        res.status(201).json({ compraGuardada });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ha ocurrido un error al crear la compra' });
    }
};