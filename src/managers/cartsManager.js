import { cartModel } from "../models/cartsModel.js";
import { productModel } from "../models/productsModel.js";
import procesaErrores from "../utils.js";

export default class Carts {
  constructor() {}

  getAll = async () => {
    try {
      const carritos = await cartModel.find().lean();
      return { success: true, payload: carritos };
    } catch (error) {
      throw new Error("Error al obtener los carritos");
    }
  }

  getById = async (id) => {
    try {
      const carrito = await cartModel.findById(id);
      return {success : true, payload : carrito};
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  updateCart = async (id, cart) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(id, cart);
      return {success : true, payload : updatedCart};
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  deleteCart = async (id) => {
    try {
      const deletedCart = await cartModel.findByIdAndDelete(id);
      return {success : true, payload : deletedCart};
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  //Anadir producto al carrito
  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
      if (productIndex !== -1) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        cart.products[productIndex].quantity += 1;
      } else {
        // Si el producto no está en el carrito, agrégalo con la información del producto
        cart.products.push({ 
          product: productId, 
          quantity: 1, 
          model: product.model, 
          price: product.price 
        });
      }

      await cart.save();
      return { success: true, payload: cart };
    } catch (error) {
      throw new Error("Error al agregar el producto al carrito");
    }
  }


  //Eliminar producto del carrito
  removeProductFromCart = async (id, productId) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(id, {
        $pull: {
          products: productId
        }
      });
      return {success : true, payload : updatedCart};
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  addCart = async (cart) => {
    try {
      const newCart = await cartModel.create(cart);
      return {success : true, payload : newCart};
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  removeProductFromCart = async (cartId, productId) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(id, {
        $pull: {
          products: productId
        }
      });
      return {success : true, payload : updatedCart};
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  updateCart = async (cartId, cartData) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(cartId, cartData);
      return {success : true, payload : updatedCart};
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
        $set: {
          'products.$.quantity': quantity
        }
      });
      return {success : true, payload : updatedCart};
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  clearCart = async (cartId) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
        $set: {
          products: []
        }
      });
      return {success : true, payload : updatedCart};
    } catch (error) {
      procesaErrores(res, error);
    }
  };
}
