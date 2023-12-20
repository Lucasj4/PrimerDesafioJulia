const ProductManager = require("./product-manager.js");



const manager = new ProductManager("../productos.json");





const express = require("express");

const app = express();
const port = 8080;

app.get("/products", async (req, res) => {
    try {
      const { limit } = req.query;
      const products = await manager.getProducts(limit);
      res.json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).send("Error interno del servidor");
    }
  });

  app.get("/products/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
        const product = await manager.getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error al obtener el producto por ID", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

  
  app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
  });