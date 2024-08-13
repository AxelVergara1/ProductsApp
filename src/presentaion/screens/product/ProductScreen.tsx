import {useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Button,
  ButtonGroup,
  Input,
  Layout,
  Modal,
  Text,
  useTheme,
  Card,
} from '@ui-kitten/components';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {Formik} from 'formik';
import {getProductById, updateCreateProduct} from '../../../actions/products';
import {MainLayout} from '../../layouts/MainLayout';
import {MyIcon} from '../../components/ui/MyIcon';
import {Product} from '../../../domain/entities/product';
import {ProductImages} from '../../components/products';
import {genders, sizes} from '../../../config/constants/constants';
import {CameraAdapter} from '../../../config/adapters/camera-adapter';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}

export const ProductScreen = ({navigation, route}: Props) => {
  const productIDRef = useRef(route.params.productID);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);

  const {data: product} = useQuery({
    queryKey: ['product', productIDRef.current],
    queryFn: () => getProductById(productIDRef.current),
  });

  const mutation = useMutation({
    mutationFn: (data: Product) =>
      updateCreateProduct({...data, id: productIDRef.current}),
    onSuccess(data: Product) {
      productIDRef.current = data.id; // creacion
      queryClient.invalidateQueries({queryKey: ['products', 'infinite']});
      queryClient.invalidateQueries({queryKey: ['product', data.id]});
    },
  });

  if (!product) {
    return <MainLayout title="Cargando..."></MainLayout>;
  }

  return (
    <Formik
      initialValues={product}
      onSubmit={values => mutation.mutate(values)}>
      {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
        <MainLayout
          title={values.title}
          subtitle={`Precio: $${values.price}`}
          rightAction={() => setModalVisible(true)}
          rightActionIcon="image-outline">
          <ScrollView style={{flex: 1}}>
            {/* imagenes del producto */}
            <Layout
              style={{
                marginVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ProductImages images={values.images} />
            </Layout>
            {/* Formulario   */}

            <Layout style={{marginHorizontal: 10}}>
              <Input
                label="Titulo"
                value={values.title}
                style={{marginVertical: 5}}
                onChangeText={handleChange('title')}
              />
              <Input
                label="Slug"
                value={values.slug}
                style={{marginVertical: 5}}
                onChangeText={handleChange('slug')}
              />
              <Input
                label="Descripcion"
                value={values.description}
                multiline
                numberOfLines={5}
                style={{marginVertical: 5}}
                onChangeText={handleChange('description')}
              />
            </Layout>

            {/* precio inventario */}
            <Layout
              style={{
                marginHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
                marginVertical: 5,
              }}>
              <Input
                label="Precio"
                value={values.price.toString()}
                style={{flex: 1}}
                onChangeText={handleChange('price')}
                keyboardType="numeric"
              />
              <Input
                label="Inventario"
                value={values.stock.toString()}
                style={{flex: 1}}
                onChangeText={handleChange('stock')}
                keyboardType="numeric"
              />
            </Layout>

            {/* selectores */}
            <ButtonGroup
              style={{
                margin: 2,
                marginTop: 20,
                marginHorizontal: 15,
              }}
              size="small"
              appearance="outline">
              {sizes.map(size => (
                <Button
                  onPress={() =>
                    setFieldValue(
                      'sizes',
                      values.sizes.includes(size)
                        ? values.sizes.filter(s => s !== size)
                        : [...values.sizes, size],
                    )
                  }
                  style={{
                    flex: 1,
                    backgroundColor: values.sizes.includes(size)
                      ? theme['color-primary-200']
                      : undefined,
                  }}
                  key={size}>
                  {size}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup
              style={{
                margin: 2,
                marginTop: 20,
                marginHorizontal: 15,
              }}
              size="small"
              appearance="outline">
              {genders.map(gender => (
                <Button
                  style={{
                    flex: 1,
                    backgroundColor: values.gender.startsWith(gender)
                      ? theme['color-primary-200']
                      : undefined,
                  }}
                  onPress={() => setFieldValue('gender', gender)}
                  key={gender}>
                  {gender}
                </Button>
              ))}
            </ButtonGroup>

            {/* BOTON GUARDAR */}
            <Button
              accessoryLeft={<MyIcon name="save-outline" white />}
              onPress={() => handleSubmit()}
              disabled={mutation.isPending}
              style={{margin: 15}}>
              Guardar
            </Button>
            <Text>{JSON.stringify(values, null, 2)}</Text>
            <Layout style={{height: 200}} />
          </ScrollView>
          {/* Modal para seleccionar acción */}
          <Modal
            visible={modalVisible}
            backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
            onBackdropPress={() => setModalVisible(false)}>
            <Card disabled={true}>
              <Text category="h6">Seleccionar opción</Text>
              <Button
                accessoryLeft={props => (
                  <MyIcon name="image-outline" />
                )}
                style={{marginVertical: 10}}
                onPress={async () => {
                  const photos = await CameraAdapter.getPicturesFromLibrary();
                  setFieldValue('images', [...values.images, ...photos]);
                  setModalVisible(false);
                }}>
                Seleccionar de la galería
              </Button>
              <Button
                accessoryLeft={props => (
                  <MyIcon name="camera-outline" />
                )}
                style={{marginVertical: 10}}
                onPress={async () => {
                  const photo = await CameraAdapter.takePicture();
                  setFieldValue('images', [...values.images, ...photo]);
                  setModalVisible(false);
                }}>
                Tomar una foto
              </Button>
              <Button
                accessoryLeft={props => (
                  <MyIcon name="close-outline" />
                )}
                style={{marginVertical: 10}}
                appearance="outline"
                status="danger"
                onPress={() => setModalVisible(false)}>
                Cancelar
              </Button>
            </Card>
          </Modal>
        </MainLayout>
      )}
    </Formik>
  );
};
