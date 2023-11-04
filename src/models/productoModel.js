import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  Identificador: { type: String, required: true, unique: true },
  Nombre: { type: String, required: true },
  Marca: { type: String, required: true },
  Disponibilidad: { type: Number, required: true },
  Precio: { type: Number, required: true },
  Descuento: { type: Number, required: true },
  PrecioDescuento: { type: Number, required: true},
  Imagen: { type: String, required: true },
  Descripcion: { type: String, required: true },
  Categorias: [{ type: String, required: true }],
  Habilitado: { type: Boolean, required: true }
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;
