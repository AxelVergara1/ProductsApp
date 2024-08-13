import React from 'react';
import {getProductsByPage} from '../../../actions/products/get-products-by-page';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {MainLayout} from '../../layouts/MainLayout';
import {FullScreenLoader} from '../../components/ui/FullScreenLoader';
import {ProductList} from '../../components/products/ProductList';
import {FAB} from '../../components/ui/FAB';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../../navigation/StackNavigator';

export const HomeScreen = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  // const {isLoading, data: products = []} = useQuery({
  //   queryKey: ['products', 'infinite'],
  //   staleTime: 1000 * 60 * 60, //1 hora
  //   queryFn: () => getProductsByPage(0),
  // });

  const {isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 60, //1 hora
    initialPageParam: 0,
    queryFn: async params => {
      const products = await getProductsByPage(params.pageParam);
      products.forEach(product => {
        queryClient.setQueryData(['product', product.id], product);
      });
      return products;
    },
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  return (
    <>
      <MainLayout
        title="TesloShop - Products"
        subtitle="Aplicacion administratica">
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <ProductList
            products={data?.pages.flat() ?? []}
            fetchNextPage={fetchNextPage}
          />
        )}
      </MainLayout>
      <FAB
        style={{position: 'absolute', bottom: 30, right: 25}}
        iconName="plus-outline"
        onPress={() => navigation.navigate('ProductScreen', {productID: 'new'})}
      />
    </>
  );
};
