import { Router } from "express";

import Carts from "../managers/cartsManager.js";

const cartsManager = new Carts();

const router = Router();

//GET
router.get('/', (req, res) => {
    const carts = cartsManager.getAll();
    res.send({status : 'success', payload : carts});
});

//POST
router.post('/', async (req, res) => {
    const cart = req.body;
    const newCart = await cartsManager.addCart(cart);
    res.send({status : 'success', payload : newCart});
});

//GET por id
router.get('/:id', async (req, res) => {
    const cart = await cartsManager.getById(req.params.id);
    res.send({status : 'success', payload : cart});
});

//PUT
router.put('/:id', async (req, res) => {
    const cart = req.body;
    const updatedCart = await cartsManager.updateCart(req.params.id, cart);
    res.send({status : 'success', payload : updatedCart});
});

//DELETE
router.delete('/:id', async (req, res) => {
    const deletedCart = await cartsManager.deleteCart(req.params.id);
    res.send({status : 'success', payload : deletedCart});
});

//POST - Agregar producto al carrito
router.post('/:cartId/product/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const cart = await cartsManager.getById(cartId);

    if (!cart){
        res.send({status : 'error', message : 'No se encontro el carrito'});
    }

    const updatedCart = await cartsManager.addProductToCart(cartId, productId);
    res.send({status : 'success', payload : updatedCart});
});

// DELETE - Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartsManager.removeProductFromCart(cid, pid);
        res.send({status : 'success', payload : updatedCart});
    } catch (error) {
        res.status(400).send({status : 'error', message : error.message});
    }
});

// PUT - Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const updatedCart = await cartsManager.updateCart(cid, { products });
        res.send({status : 'success', payload : updatedCart});
    } catch (error) {
        res.status(400).send({status : 'error', message : error.message});
    }
});

// PUT - Actualizar la cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartsManager.updateProductQuantity(cid, pid, quantity);
        res.send({status : 'success', payload : updatedCart});
    } catch (error) {
        res.status(400).send({status : 'error', message : error.message});
    }
});

// DELETE - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartsManager.clearCart(cid);
        res.send({status : 'success', payload : updatedCart});
    } catch (error) {
        res.status(400).send({status : 'error', message : error.message});
    }
});




export default router;