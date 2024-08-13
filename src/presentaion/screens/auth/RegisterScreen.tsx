import {Button, Card, Input, Layout, Modal, Text} from '@ui-kitten/components';
import {useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {MyIcon} from '../../components/ui/MyIcon';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useState} from 'react';
import {useAuthStore} from '../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {register} = useAuthStore();
  const {height} = useWindowDimensions();
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({email: '', password: '', fullname: ''});
  const [errors, setErrors] = useState({email: '', password: '', fullname: ''});
  const [showModal, setShowModal] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>0-9]).{8,}$/;

  const validate = () => {
    let valid = true;
    let emailError = '';
    let passwordError = '';
    let fullNameError = '';

    if (!emailRegex.test(form.email)) {
      emailError = 'Formato de correo inválido';
      valid = false;
    }
    if (!passwordRegex.test(form.password)) {
      passwordError =
        'La contraseña debe tener al menos 8 caracteres y contener al menos un signo o número';
      valid = false;
    }
    if (form.fullname.length === 0) {
      fullNameError = 'Ingresa un nombre de usuario';
      valid = false;
    }

    setErrors({
      email: emailError,
      password: passwordError,
      fullname: fullNameError,
    });
    return valid;
  };

  const onRegister = async () => {
    if (!validate()) return;
    setIsPosting(true);

    const wasSuccessful = await register(
      form.email,
      form.password,
      form.fullname,
    );
    setIsPosting(false);
    if (!wasSuccessful) {
      setShowModal(true);
    }
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.3}}>
          <Text category="h1">Crear cuenta</Text>
          <Text category="p2">Por favor, crea una cuenta para continuar</Text>
        </Layout>

        {/* inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Nombre de usuario"
            accessoryLeft={<MyIcon name="person-outline" />}
            autoCapitalize="words"
            value={form.fullname}
            onChangeText={fullname => {
              setForm({...form, fullname});
              if (errors.fullname) validate();
            }}
            style={{marginBottom: 10}}
            status={errors.fullname ? 'danger' : 'basic'}
          />
          {errors.fullname ? (
            <Text style={{marginBottom: 10}} status="danger">
              {errors.fullname}
            </Text>
          ) : null}

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
              if (passwordRegex.test(password)) {
                setErrors({...errors, password: ''});
              } else {
                setErrors({
                  ...errors,
                  password:
                    'La contraseña debe tener al menos 8 caracteres y contener al menos un signo o número',
                });
              }
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
            onPress={onRegister}
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}>
            Crear cuenta
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
          <Text>¿Ya tienes cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.goBack()}>
            {' '}
            Iniciar sesion
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
            Cuenta ya existente. Por favor, inténtelo de nuevo.
          </Text>
          <Layout
            style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 20, 
            }}>
            <Text>¿Ya tienes cuenta?</Text>
            <Text
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('LoginScreen')}>
              {' '}
              Ingresar
            </Text>
          </Layout>
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
