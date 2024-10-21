import { Router } from 'express';

import Products from "../managers/productsManager.js";
import Carts from "../managers/cartsManager.js";

import { auth } from '../middleware/auth.js';

const router = Router();
const productsManager = new Products();
const cartsManager = new Carts();

router.get('/', async (req, res) => {
    console.log('Iniciando request a /');
    try {
        console.log('Intentando obtener productos...');
        const result = await productsManager.getAll(req.query);
        console.log('Productos obtenidos');
        res.render('products', { 
            ...result,
            limit: req.query.limit || 10,
            query: req.query.query || '',
            sort: req.query.sort || ''
        });
    } catch (error) {
        res.status(500).send("Error al obtener productos");
        console.error("Error:", error);
    }
});

router.get('/carts', auth, async (req, res) => {
    try {
      const carts = await cartsManager.getAll();
      const flattenedCarts = carts.payload.map(cart => ({
        ...cart,
        products: cart.products.map(item => ({
          ...item,
          model: item.model,
          price: item.price,
          quantity: item.quantity
        }))
      }));
      res.render('carts', { carts: flattenedCarts });
    } catch (error) {
      res.status(500).send("Error al obtener carritos");
      console.error("Error:", error);
    }
  });

router.get('/product/:id', async (req, res) => {
    try {
        const product = await productsManager.getById(req.params.id);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render('detail', { 
            ...product
        });
    } catch (error) {
        res.status(500).send("Error al obtener producto");
        console.error("Error:", error);
    }
});

router.get('/registro',(req,res)=>{

  res.status(200).render('registro')
})

router.get('/login',(req,res)=>{

  res.status(200).render('login')
})

router.get('/perfil', auth, (req,res)=>{

  let usuario=req.user;
  res.status(200).render('perfil', {
      usuario
  })
})




export default router;