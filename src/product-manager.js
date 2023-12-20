const fs = require("fs").promises;

class ProductManager {

    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(producto) {
        let { title, description, price, img, code, stock } = producto;

        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Es obligatorio completar todos los campos ");
            return;
        }


        if (this.products.some(item => item.code === code)) {
            console.log("El codigo no debe repetirse");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        this.products.push(newProduct);

        await this.saveFile(this.products);
    }

    async getProducts(limit) {
        try {
            const arrayProductos = await this.readFile();

            if (limit) {
                const limitedProducts = arrayProductos.slice(0, limit);
                return limitedProducts;
            } else {
                return arrayProductos;
            }
        } catch (error) {
            console.log("Error al obtener productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.readFile();
            const buscado = arrayProductos.find(item => item.id === id);
    
            if (!buscado) {
                console.log("Producto no encontrado");
                return null; // Devuelve null si el producto no se encuentra
            } else {
                return buscado; // Devuelve el producto si se encuentra
            }
        } catch (error) {
            console.log("Error al leer archivo", error);
            throw error;
        }


    
    }

    async readFile() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {
            console.log("Error al leer  archivo", error);
        }
    }

    async saveFile(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar  archivo", error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const arrayProductos = await this.readFile();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {

                arrayProductos[index] = { ...arrayProductos[index], ...updatedProduct };

                await this.saveFile(arrayProductos);
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.readFile();

            const updatedProducts = arrayProductos.filter(item => item.id !== id);

            if (updatedProducts.length < arrayProductos.length) {
                await this.saveFile(updatedProducts);
                console.log("Producto eliminado con éxito");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }


}





  


async function run() {
    const manager = new ProductManager("./productos.json");
    const nuevosProductos = [
        {
            id: 2,
            title: "Monitor Curvo",
            description: "Monitor de 27 pulgadas con pantalla curva para una experiencia inmersiva",
            price: 25000,
            img: "sin imagen",
            code: "abc127",
            stock: 15
        },
        {
            id: 3,
            title: "Laptop Ultradelgada",
            description: "Laptop ultraligera y delgada con procesador de última generación",
            price: 35000,
            img: "sin imagen",
            code: "abc128",
            stock: 10
        },
        {
            id: 4,
            title: "Impresora Multifunción",
            description: "Impresora que imprime, escanea y copia con gran calidad",
            price: 8000,
            img: "sin imagen",
            code: "abc129",
            stock: 25
        },
        {
            id: 5,
            title: "Cámara de Seguridad",
            description: "Cámara de seguridad con visión nocturna para el hogar",
            price: 12000,
            img: "sin imagen",
            code: "abc130",
            stock: 18
        },
        {
            id: 6,
            title: "Altavoces Bluetooth",
            description: "Altavoces inalámbricos con sonido de alta fidelidad",
            price: 15000,
            img: "sin imagen",
            code: "abc131",
            stock: 20
        },
        {
            id: 7,
            title: "Aire Acondicionado Inteligente",
            description: "Aire acondicionado controlable desde el teléfono móvil",
            price: 30000,
            img: "sin imagen",
            code: "abc132",
            stock: 12
        },
        {
            id: 8,
            title: "Robot Aspirador",
            description: "Robot inteligente que limpia automáticamente tu hogar",
            price: 18000,
            img: "sin imagen",
            code: "abc133",
            stock: 15
        },
        {
            id: 9,
            title: "Teclado Inalámbrico Retroiluminado",
            description: "Teclado inalámbrico con retroiluminación LED y diseño compacto",
            price: 12000,
            img: "sin imagen",
            code: "abc134",
            stock: 22
        },
        {
            id: 10,
            title: "Mochila para Portátil",
            description: "Mochila resistente y acolchada para transportar tu portátil con seguridad",
            price: 5000,
            img: "sin imagen",
            code: "abc135",
            stock: 30
        },
        {
         
            title: "Mochila para Portátil 2",
            description: "Mochila resistente y acolchada para transportar tu portátil con seguridad",
            price: 5000,
            img: "sin imagen",
            code: "abc136",
            stock: 30
        }
    ];

    // Agrega los nuevos productos al manager
    for (const producto of nuevosProductos) {
        await manager.addProduct(producto);
    }

    // Obtiene y muestra la lista actualizada de productos
    const productosActualizados = await manager.getProducts();
    console.log(productosActualizados);
}

// Llama a la función run
run().catch(error => console.error(error));
module.exports = ProductManager;