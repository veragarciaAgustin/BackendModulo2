import { Router } from "express";
import procesaErrores from "../utils.js";

import Carts from "../managers/cartsManager.js";

const cartsManager = new Carts();

const router = Router();

//GET
router.get("/", async (req, res) => {
  try {
    const result = await cartsManager.getAll();
    res.render("carts", { carts: result.payload });
  } catch (error) {
    procesaErrores(res, error);
  }
});
//POST
router.post("/", async (req, res) => {
  try {
    const cart = req.body;
    const newCart = await cartsManager.addCart(cart);
    res.send({ status: "success", payload: newCart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

//GET por id
router.get("/:id", async (req, res) => {
  try {
    const cart = await cartsManager.getById(req.params.id);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });
    }
    res.send({ status: "success", payload: cart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

//PUT
router.put("/:id", async (req, res) => {
  try {
    const cart = req.body;
    const updatedCart = await cartsManager.updateCart(req.params.id, cart);
    res.send({ status: "success", payload: updatedCart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deletedCart = await cartsManager.deleteCart(req.params.id);
    res.send({ status: "success", payload: deletedCart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

//POST - Agregar producto al carrito
router.post("/:cartId/product/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await cartsManager.getById(cartId);

    if (!cart) {
      res.send({ status: "error", message: "No se encontro el carrito" });
    }

    const updatedCart = await cartsManager.addProductToCart(cartId, productId);
    res.send({ status: "success", payload: updatedCart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

// DELETE - Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartsManager.removeProductFromCart(cid, pid);
    res.send({ status: "success", payload: updatedCart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

// PUT - Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const updatedCart = await cartsManager.updateCart(cid, { products });
    res.send({ status: "success", payload: updatedCart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

// PUT - Actualizar la cantidad de ejemplares de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartsManager.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    res.send({ status: "success", payload: updatedCart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

// DELETE - Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartsManager.clearCart(cid);
    res.send({ status: "success", payload: updatedCart });
  } catch (error) {
    procesaErrores(res, error);
  }
});

export default router;
