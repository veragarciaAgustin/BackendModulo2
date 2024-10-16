import { cartModel } from "../models/cartsModel.js";
import { productModel } from "../models/productsModel.js";

export default class Carts {
  constructor() {}

  getAll = async () => {
    const carritos = await cartModel.find().lean();
    return {success : true, payload : carritos};
  };

  getById = async (id) => {
    const carrito = await cartModel.findById(id);
    return {success : true, payload : carrito};
  };

  updateCart = async (id, cart) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(id, cart);
      return {success : true, payload : updatedCart};
    } catch (error) {
      console.log(error);
    }
  };

  deleteCart = async (id) => {
    try {
      const deletedCart = await cartModel.findByIdAndDelete(id);
      return {success : true, payload : deletedCart};
    } catch (error) {
      console.log(error);
    }
  };

  //Anadir producto al carrito
  addProductToCart = async (cartId, productId, quantity) => {
    try {
      // Primero, obtén el producto para acceder a su modelo y precio
      const product = await productModel.findById(productId);
      
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      const updatedCart = await cartModel.findByIdAndUpdate(
        cartId,
        {
          $push: {
            products: {
              product: productId,
              model: product.model,
              price: product.price,
              quantity: quantity
            }
          }
        },
        { new: true }
      );

      return { success: true, payload: updatedCart };
    } catch (error) {
      console.error('Error al añadir producto al carrito:', error);
      return { success: false, error: error.message };
    }
  };


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
      console.log(error);
    }
  };

  addCart = async (cart) => {
    try {
      const newCart = await cartModel.create(cart);
      return {success : true, payload : newCart};
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };

  updateCart = async (cartId, cartData) => {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(cartId, cartData);
      return {success : true, payload : updatedCart};
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    }
  };
}
