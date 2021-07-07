/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import React, {createContext, useEffect, useState} from 'react';
import {ToastAndroid, useColorScheme} from 'react-native';
import * as Yup from 'yup';
import Main from './pages';
import Auth from './pages/auth';

const Schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
});
const FirebaseContext = createContext(null);
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState(false);
  useEffect(() => {
    const unregister = auth().onAuthStateChanged(user => {
      if (user) {
        firestore()
          .collection('users')
          .doc(user.email)
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists && documentSnapshot.data().isActive) {
              setData(documentSnapshot.data());
            } else {
              console.log('documentSnapshot.data()', documentSnapshot.data());
              ToastAndroid.show(
                'Your account is not active, contact your mess manager',
                ToastAndroid.LONG,
              );
              auth().signOut();
            }
          })
          .catch(err => {
            console.log('err', err);
          });
      } else {
        setData(null);
      }
    });
    return () => {
      unregister();
    };
  }, []);
  if (data === false) {
    return <></>;
  }
  return (
    <NavigationContainer
    // theme={{
    //   dark: false,
    //   colors: {
    //     primary: 'rgb(255, 45, 85)',
    //     background: 'rgb(242, 242, 242)',
    //     card: 'rgb(255, 255, 255)',
    //     text: 'rgb(28, 28, 30)',
    //     border: 'rgb(199, 199, 204)',
    //     notification: 'rgb(255, 69, 58)',
    //   },
    // }}
    >
      <FirebaseContext.Provider value={data}>
        {data ? <Main /> : <Auth />}
      </FirebaseContext.Provider>
    </NavigationContainer>
  );
};

export default App;
export {FirebaseContext};
