import { productModel } from "../models/productsModel.js";
import procesaErrores from "../utils.js";

export default class Products {
  constructor() {}

  getAll = async (queryParams) => {
    try {
      const { limit = 10, page = 1, sort, query, populate } = queryParams;
      
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true
      };
  
      if (sort) {
        options.sort = { [sort]: 1 };
      }
  
      const filter = {};
      if (query) {
        filter.$or = [
          { model: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } }
        ];
      }

      let queryExecution = productModel.paginate(filter, options);
  
      if (populate === 'true') {
        queryExecution = productModel.paginate(filter, {...options, populate: 'carts'});
      }
  
      const result = await queryExecution;
  
      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/?limit=${limit}&page=${result.prevPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
        nextLink: result.hasNextPage ? `/?limit=${limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
      };
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  getById = async (id) => {
    const product = await productModel.findById(id);
    return product.toObject();
  };

  updateProduct = async (id, product) => {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(id, product);
      return updatedProduct;
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  deleteProduct = async (id) => {
    try {
      const deletedProduct = await productModel.findByIdAndDelete(id);
      return deletedProduct;
    } catch (error) {
      procesaErrores(res, error);
    }
  };

  addProduct = async (product) => {
    try {
      const newProduct = await productModel.create(product);
      return newProduct;
    } catch (error) {
      procesaErrores(res, error);
    }
  };
}
