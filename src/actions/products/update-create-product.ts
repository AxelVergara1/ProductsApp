import {isAxiosError} from 'axios';
import {tesloAPI} from '../../config/api/TesloAPI';
import {Product} from '../../domain/entities/product';

export const updateCreateProduct = (product: Partial<Product>) => {
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = isNaN(Number(product.price)) ? 0 : Number(product.price);

  if (product.id && product.id !== 'new') {
    return updateProduct(product);
  }

  return createProduct(product);
};

const prepareImages = async (images: string[]) => {
  //TODO Revisar los FILES
  const fileImages = images.filter(image => image.includes('file://'));
  const currentImages = images.filter(image => !image.includes('file://'));

  if (fileImages.length > 0) {
    const uploadPromises = fileImages.map(image => uploadImage(image));
    const uploadImages = await Promise.all(uploadPromises);
    currentImages.push(...uploadImages);
  }

  return currentImages.map(image => image.split('/').pop());
};

const uploadImage = async (image: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: image,
    type: 'image/jpeg',
    name: image.split('/').pop()
  });
  const { data }= await tesloAPI.post<{ image: string }>(
    '/files/product', formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    },
  );
  return data.image;
};

//TODO Revisar si viene el usuario
const updateProduct = async (product: Partial<Product>) => {
  const {id, images = [], ...rest} = product;
try {
    const checkedImages = await prepareImages(images);
  
    const { data } = await tesloAPI.patch(`/products/${id}`, {
      images: checkedImages,
      ...rest
    })

    return data;
    
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    }
    throw new Error('Error al actualizar producto');
  }
};

const createProduct = async (product: Partial<Product>) => {
  const {id, images = [], ...rest} = product;

  try {
    const checkImages = await prepareImages(images);

    const {data} = await tesloAPI.post(`/products/`, {
      images: checkImages,
      ...rest,
    });

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    }
    throw new Error('Error al actualizar producto');
  }
};
