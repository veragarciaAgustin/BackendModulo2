import { Router } from "express";
import { auth } from '../middleware/auth.js';

import Products from "../managers/productsManager.js";

const productsManager = new Products();

const router = Router();

router.get('/', auth, (req, res) => {
    const products = productsManager.getAll(req.query);
    res.send({status : 'success', payload : products});
});

router.post('/', async (req, res) => {
    const product = req.body;
    const newProduct = await productsManager.addProduct(product);
    res.send({status : 'success', data : newProduct});
});

router.get('/:id', async (req, res) => {
    const product = await productsManager.getById(req.params.id);
    res.send({status : 'success', data : product});
});

router.put('/:id', async (req, res) => {
    const product = req.body;
    const updatedProduct = await productsManager.updateProduct(req.params.id, product);
    res.send({status : 'success', data : updatedProduct});
});

router.delete('/:id', async (req, res) => {
    const deletedProduct = await productsManager.deleteProduct(req.params.id);
    res.send({status : 'success', data : deletedProduct});
});


export default router;