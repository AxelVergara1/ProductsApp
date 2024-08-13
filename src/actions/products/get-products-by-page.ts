import {tesloAPI} from '../../config/api/TesloAPI';
import type {Product} from '../../domain/entities/product';
import type {TesloProduct} from '../../infrastructure/interfaces/teslo-products.response';
import {ProductMapper} from '../../infrastructure/mappers/product.mapper';

export const getProductsByPage = async (
  page: number,
  limit: number = 20,
): Promise<Product[]> => {
  try {
    const {data} = await tesloAPI.get<TesloProduct[]>(
      `/products?offset=${page * 10}&limit=${limit}`,
    );
    const products = data.map(tesloProduct =>
      ProductMapper.tesloProductToEntity(tesloProduct),
    );

    return products;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
