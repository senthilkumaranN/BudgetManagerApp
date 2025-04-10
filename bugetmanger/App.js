import {StyleSheet, Text, View, StatusBar} from 'react-native';
import StackNavigation from './Navigation/StackNavigation';
import Toast from 'react-native-toast-message';
import CustomToast from './components/CustomToast';
import {ModalPortal} from 'react-native-modals';
import SplashScreen from 'react-native-splash-screen';
import {useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Hide splash screen after short timeout
    setTimeout(() => {
      SplashScreen.hide();
    }, 500); // 👈 500ms delay
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <StackNavigation />
      <Toast
        config={{
          success: props => (
            <CustomToast {...props} type="success" hide={() => Toast.hide()} />
          ),
          error: props => (
            <CustomToast {...props} type="error" hide={() => Toast.hide()} />
          ),
        }}
        position="bottom"
        visibilityTime={3000}
        autoHide
      />
      <ModalPortal />
    </>
  );
}

const styles = StyleSheet.create({});
