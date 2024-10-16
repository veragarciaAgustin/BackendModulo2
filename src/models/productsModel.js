import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "Products";

const productSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    colour: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    storage: {
        type: Number,
        required: true
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para obtener los carritos que contienen este producto
productSchema.virtual('carts', {
    ref: 'Carts',
    localField: '_id',
    foreignField: 'products.product'
});
productSchema.index({ brand: 1, model: 1 });

// productSchema.pre('find', function() {
//     this.populate({
//         path: 'carts',
//         select: '_id' // Solo selecciona el ID del carrito
//     });
// });

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);