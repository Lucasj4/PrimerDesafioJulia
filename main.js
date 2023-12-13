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

    getProducts() {
        console.log(this.products);
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.readFile();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
            } else {
                const producto = JSON.stringify(buscado, null, 2);
                console.log(`Producto encontrado : ${producto}`);
            }
        } catch (error) {
            console.log("Error al leer archivo", error);
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

const manager = new ProductManager("./productos.json");



const auriculares = {
    title: "Auriculares",
    description: "Mejora tu experiencia gamer",
    price: 15000,
    img: "sin imagen",
    code: "abc123",
    stock: 30
}



manager.addProduct(auriculares);

const teclado = {
    title: "Red Dragon",
    description: "Mejora tu experiencia gamer",
    price: 25000,
    img: "sin imagen",
    code: "abc124",
    stock: 100
}


manager.addProduct(teclado);

manager.getProducts();

manager.getProductById(1);

const teclado2 = {
    title: "Red Dragon",
    description: "Mejora tu experiencia gamer",
    price: 25000,
    img: "sin imagen",
    code: "abc124",
    stock: 200
}


async function testeamosEliminar() {
    await manager.deleteProduct(2);
}

testeamosEliminar();