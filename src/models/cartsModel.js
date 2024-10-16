import mongoose from "mongoose";

const cartCollection = "Carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      model: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

cartSchema.index({ "products.product": 1 });

// Middleware para popular los productos
// cartSchema.pre('find', function() {
//     this.populate({
//         path: 'products.product',
//         select: 'brand model colour price'
//     });
// });

export const cartModel = mongoose.model(cartCollection, cartSchema);
