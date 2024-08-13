import {PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export class CameraAdapter {
  static async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permiso para usar la cámara',
          message:
            'Esta aplicación necesita acceso a tu cámara para tomar fotos.',
          buttonNeutral: 'Preguntar después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  static async requestGalleryPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: "Permiso para acceder a la galería",
                message: "Esta aplicación necesita acceso a tu galería para seleccionar fotos.",
                buttonNeutral: "Preguntar después",
                buttonNegative: "Cancelar",
                buttonPositive: "OK"
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.warn(err);
        return false;
    }
}

  static async takePicture(): Promise<string[]> {
    const hasPermission = await CameraAdapter.requestCameraPermission();
    if (!hasPermission) {
      return [];
    }

    const response = await launchCamera({
      mediaType: 'photo',
      quality: 0.7,
      cameraType: 'front',
    });

    if (response.assets && response.assets[0].uri) {
      return [response.assets[0].uri];
    }

    return [];
  }

  static async getPicturesFromLibrary(): Promise<string[]> {

    const hasPermission = await CameraAdapter.requestGalleryPermission();
    if (!hasPermission) {
        return [];
    }
    
    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 10,
    });
    if (response.assets && response.assets.length > 0) {
      return response.assets.map(asset => asset.uri!);
    }
    return [];
  }
}
