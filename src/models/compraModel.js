import mongoose from 'mongoose';

const compraSchema = new mongoose.Schema({
  Usuario: { type: String, required: true },
  Carrito: { type: String, required: true },
  Total: { type: Number, required: true },
  FechaCompra: { type: Date, required: true }
});

const Compra = mongoose.model('Compra', compraSchema);

export default Compra;
