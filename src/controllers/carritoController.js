import Carrito from "../models/carritoModel.js";
import Producto from "../models/productoModel.js";

export const addCarrito = async (req, res) => {
    try {
        const { 
            Identificador,
            Nombre,
            Marca,
            Precio,
            Descuento,
            Imagen,
            Descripcion,
            Cantidad
        } = req.body;

        var product = await Producto.findOne({Identificador});

        if ((product.Disponibilidad - Cantidad) <= -1){
            return res.status(404).json({ message: 'No hay cantidad suficiente en stock del producto' });
        }
        
        var predioDesc = (Precio-Descuento);
        const newCarrito = new Carrito({
            Productos: [{
                Identificador: Identificador,
                Nombre: Nombre,
                Marca: Marca,
                Precio: Precio,
                Descuento: Descuento,
                PrecioDescuento: predioDesc,
                Imagen: Imagen,
                Descripcion: Descripcion,
                Cantidad: Cantidad
            }],
            Total: (predioDesc*Cantidad),
            Usuario: req.user._id
        });
        var carritoGuardado = await newCarrito.save();
    
        var nuevaDisponibilidad = product.Disponibilidad - Cantidad;
        product.Disponibilidad = nuevaDisponibilidad;
        product.save();

        // Enviar una respuesta al cliente
        res.status(201).json({ carritoGuardado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ha ocurrido un error al crear el carrito' });
    }
};

export const getCarrito = async (req, res) => {
    try {
        const { ID } = req.params;

        // Buscar un usuario por su ID en la base de datos
        const carritoBuscado = await Carrito.findById(ID);
        if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Enviar una respuesta al cliente
        res.status(200).json(carritoBuscado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al obtener el carrito' });
    }
};

export const updateProductoCarrito = async (req, res) => {
    try {
        const { 
            Identificador,
            Nombre,
            Marca,
            Precio,
            Descuento,
            Imagen,
            Descripcion,
            Cantidad
        } = req.body;
  
        const { ID } = req.params;

        const carritoBuscado = await Carrito.findById(ID);
        if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        var productoEncontrado = carritoBuscado.Productos.find( produ => produ.Identificador === Identificador);


        if(productoEncontrado){


            var product = await Producto.findOne({Identificador:Identificador});

            if(productoEncontrado.Cantidad>Cantidad){
                var cantidadASumar = productoEncontrado.Cantidad-Cantidad;
                product.Disponibilidad += cantidadASumar;
    
            }else if(productoEncontrado.Cantidad<Cantidad){
                var cantidadARestar = Cantidad-productoEncontrado.Cantidad
                if ((product.Disponibilidad - cantidadARestar) <= -1){
                    return res.status(404).json({ message: 'No hay cantidad suficiente en stock del producto' });
                }
                product.Disponibilidad -= cantidadARestar;
            }
    
            await product.save();

            carritoBuscado.Productos.forEach((elemento)=>{
                if(elemento.Identificador === productoEncontrado.Identificador){
                    elemento.Precio = Precio;
                    elemento.Descuento = Descuento;
                    elemento.PrecioDescuento = (Precio-Descuento);
                    elemento.Cantidad = Cantidad;
                }
            });
            


        }else{

            carritoBuscado.Productos = [...carritoBuscado.Productos,{
                Identificador: Identificador,
                Nombre: Nombre,
                Marca: Marca,
                Precio: Precio,
                Descuento: Descuento,
                PrecioDescuento: (Precio-Descuento),
                Imagen: Imagen,
                Descripcion: Descripcion,
                Cantidad: Cantidad
            }]

            

        }

        var nuevoTotal = 0;
        carritoBuscado.Productos.forEach((elemento)=>{
            nuevoTotal += elemento.PrecioDescuento*elemento.Cantidad;
        });

        

        carritoBuscado.Total = nuevoTotal;
        carritoBuscado.save();

        var product = await Producto.findOne({Identificador});
        var nuevaDisponibilidad = product.Disponibilidad - Cantidad;
        product.Disponibilidad = nuevaDisponibilidad;
        product.save();

  
      // Enviar una respuesta al cliente
      res.status(201).json({ carritoBuscado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ha ocurrido un error al crear el carrito' });
    }
};

export const deleteProductoCarrito = async (req, res) => {
    try {

        const { 
            Identificador
        } = req.body;

        const { ID } = req.params;
  
        const carritoBuscado = await Carrito.findById(ID);
        if (!carritoBuscado) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productoEncontrado = carritoBuscado.Productos.find(prod=> prod.Identificador === Identificador);
        if(!productoEncontrado){
            return res.status(404).json({ message: 'Ese producto no existe en el carrito' });
        }

        const productoStock = await Producto.findOne({Identificador});
        productoStock.Disponibilidad += productoEncontrado.Cantidad;
        await productoStock.save();

        carritoBuscado.Productos.pull({Identificador: Identificador });
        var nuevoTotal = 0;
        carritoBuscado.Productos.forEach((elemento)=>{
            if(elemento.Identificador !== Identificador) nuevoTotal += elemento.PrecioDescuento*elemento.Cantidad;
        });

        carritoBuscado.Total = nuevoTotal;

        await carritoBuscado.save();

        
    
        res.status(200).json(carritoBuscado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al eliminar el producto' });
    }
};
  