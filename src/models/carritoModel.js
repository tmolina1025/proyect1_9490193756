import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  Identificador: { type: String, required: true },
  Nombre: { type: String, required: true },
  Marca: { type: String, required: true },
  Precio: { type: Number, required: true },
  Descuento: { type: Number, required: true },
  PrecioDescuento: { type: Number, required: true },
  Imagen: { type: String, required: true },
  Descripcion: { type: String, required: true },
  Cantidad: { type: Number, required: true },
});

const carritoSchema = new mongoose.Schema({
  Productos: [productoSchema], 
  Total: { type: Number, required: true },
  Usuario: {type: String, required: true}
});

const Carrito = mongoose.model('Carrito', carritoSchema);

export default Carrito;
