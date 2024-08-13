import {Button, Card, Input, Layout, Modal, Text} from '@ui-kitten/components';
import {useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {MyIcon} from '../../components/ui/MyIcon';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useState} from 'react';
import {useAuthStore} from '../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: Props) => {
  const {login} = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({email: '', password: ''});
  const [errors, setErrors] = useState({email: '', password: ''});
  const [showModal, setShowModal] = useState(false);
  const {height} = useWindowDimensions();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let valid = true;
    let emailError = '';
    let passwordError = '';

    if (!emailRegex.test(form.email)) {
      emailError = 'Formato de correo inválido';
      valid = false;
    }
    if (form.password.length === 0) {
      passwordError = 'Ingresa una contraseña';
      valid = false;
    }

    setErrors({email: emailError, password: passwordError});
    return valid;
  };

  const onLogin = async () => {
    if (!validate()) return;
    setIsPosting(true);

    const wasSuccessful = await login(form.email, form.password);
    setIsPosting(false);
    if (!wasSuccessful) {
      setShowModal(true);
    }
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.35}}>
          <Text category="h1">Ingresar</Text>
          <Text category="p2">Por favor, ingrese para continuar</Text>
        </Layout>

        {/* inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Correo Electronico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={email => {
              setForm({...form, email});
              if (emailRegex.test(email)) {
                setErrors({...errors, email: ''});
              } else {
                setErrors({...errors, email: 'Formato de correo inválido'});
              }
            }}
            accessoryLeft={<MyIcon name="email-outline" />}
            style={{marginBottom: 10}}
            status={errors.email ? 'danger' : 'basic'}
          />
          {errors.email ? (
            <Text style={{marginBottom: 10}} status="danger">
              {errors.email}
            </Text>
          ) : null}

          <Input
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            value={form.password}
            onChangeText={password => {
              setForm({...form, password});
              if (errors.password) validate();
            }}
            accessoryLeft={<MyIcon name="lock-outline" />}
            style={{marginBottom: 10}}
            status={errors.password ? 'danger' : 'basic'}
          />
          {errors.password ? (
            <Text style={{marginBottom: 10}} status="danger">
              {errors.password}
            </Text>
          ) : null}
        </Layout>

        {/* espacio */}
        <Layout style={{height: 10}} />

        {/* boton */}
        <Layout>
          <Button
            disabled={isPosting}
            onPress={onLogin}
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}>
            Ingresar
          </Button>
        </Layout>

        {/* espacio */}
        <Layout style={{height: 50}} />

        {/* informacion para crear cuenta */}

        <Layout
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text>¿No tienes cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.navigate('RegisterScreen')}>
            {' '}
            Crear cuenta
          </Text>
        </Layout>
      </ScrollView>

      <Modal
        style={{padding: 20}}
        visible={showModal}
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        onBackdropPress={() => setShowModal(false)}>
        <Card disabled={true} style={{borderRadius: 10, padding: 20}}>
          <Text category="h5" style={{marginBottom: 10, textAlign: 'center'}}>
            Error
          </Text>
          <Text style={{marginBottom: 20, textAlign: 'center'}}>
            Correo o contraseña incorrectos. Por favor, inténtelo de nuevo.
          </Text>
          <Button
            onPress={() => setShowModal(false)}
            style={{alignSelf: 'center'}}>
            Cerrar
          </Button>
        </Card>
      </Modal>
    </Layout>
  );
};
