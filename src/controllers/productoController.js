import Producto from '../models/productoModel.js';


export const addProducto = async (req, res) => {
    try {
      const {
        Identificador,
        Nombre,
        Marca,
        Disponibilidad,
        Precio,
        Descuento,
        Imagen,
        Descripcion,
        Categorias,
        Habilitado
      } = req.body;
  
      if(req.user.Rol !== "Admin"){
        return res.status(400).json({ message: 'El usuario no tiene los permisos necesarios para crear un producto' });
      }

      const existProduct = await Producto.findOne({ Identificador });
      if (existProduct) {
        return res.status(400).json({ message: 'Ya existe un producto con el mismo identificador' });
      }
  
      const newProducto = new Producto({
        Identificador,
        Nombre,
        Marca,
        Disponibilidad,
        Precio,
        Descuento,
        PrecioDescuento: (Precio-Descuento),
        Imagen,
        Descripcion,
        Categorias,
        Habilitado,
      });
      var productoGuardado = await newProducto.save();
  
      // Enviar una respuesta al cliente
      res.status(201).json({ productoGuardado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ha ocurrido un error al registrar el producto' });
    }
};


export const getProductoByIdentificador = async (req, res) => {
    try {
        const { ID } = req.params;

        // Buscar un usuario por su ID en la base de datos
        const product = await Producto.findOne({Identificador: ID});
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Enviar una respuesta al cliente
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al obtener el producto' });
    }
};


export const updateProducto = async (req, res) => {
    try {
        const {
            Nombre,
            Marca,
            Disponibilidad,
            Precio,
            Descuento,
            Imagen,
            Descripcion,
            Categorias,
            Habilitado
        } = req.body;

        const { ID } = req.params;
        if(req.user.Rol !== "Admin"){
            return res.status(400).json({ message: 'El usuario no tiene los permisos necesarios para crear un producto' });
        }

        const produc = await Producto.findOne({ Identificador: ID });
        if (!produc) {
            return res.status(400).json({ message: 'No se encontro el producto que se desea actualizar' });
        }
  
      
        if(Nombre) produc.Nombre = Nombre;
        if(Marca) produc.Marca = Marca;
        if(Disponibilidad) produc.Disponibilidad = Disponibilidad;
        if(Precio) produc.Precio = Precio;
        if(Descuento) produc.Descuento = Descuento;
        if(Imagen) produc.Imagen = Imagen;
        if(Descripcion) produc.Descripcion = Descripcion;
        if(Categorias) produc.Categorias = Categorias;
        if(Habilitado) produc.Habilitado = Habilitado;

        if(Precio || Descuento){
            produc.PrecioDescuento = (Precio-Descuento);
        }

        await produc.save();
      
        res.status(201).json({ produc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al registrar el producto' });
    }
};


export const deleteProducto = async (req, res) => {
    try {
        const { ID } = req.params;
  
        if(req.user.Rol !== "Admin"){
            return res.status(400).json({ message: 'El usuario no tiene los permisos necesarios para crear un producto' });
        }

        const product = await Producto.findOne({Identificador: ID});
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
  
        product.Habilitado = false;
        await product.save();

    
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al eliminar el producto' });
    }
};
  

export const getAllProducto = async (req, res) => {
    try {
        
        // Buscar un usuario por su ID en la base de datos
        const product = await Producto.find({});
        
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al obtener el producto' });
    }
};