import { Router } from "express";
import { auth } from "../middleware/auth.js";
import procesaErrores from "../utils.js";

import Products from "../managers/productsManager.js";
import Carts from "../managers/cartsManager.js";

const productsManager = new Products();
const cartsManager = new Carts();

const router = Router();

router.get("/", auth, (req, res) => {
  try {
    const products = productsManager.getAll(req.query);
    res.send({ status: "success", payload: products });
  } catch (error) {
    procesaErrores(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productsManager.addProduct(product);
    res.send({ status: "success", data: newProduct });
  } catch (error) {
    procesaErrores(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productsManager.getById(req.params.id);
    res.send({ status: "success", data: product });
  } catch (error) {
    procesaErrores(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = req.body;
    const updatedProduct = await productsManager.updateProduct(
      req.params.id,
      product
    );
    res.send({ status: "success", data: updatedProduct });
  } catch (error) {
    procesaErrores(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await productsManager.deleteProduct(req.params.id);
    res.send({ status: "success", data: deletedProduct });
  } catch (error) {
    procesaErrores(res, error);
  }
});

// Ruta para agregar un producto al carrito
router.post("/:productId/cart", async (req, res) => {
  try {
    const { productId } = req.params;
    const { cartId } = req.body; // Asegúrate de que el ID del carrito se pase en el cuerpo de la solicitud

    const product = await productsManager.getById(productId);
    if (!product) {
      return res.status(404).send({ status: "error", message: "Producto no encontrado" });
    }

    const updatedCart = await cartsManager.addProductToCart(cartId, productId);
    res.send({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});


export default router;
