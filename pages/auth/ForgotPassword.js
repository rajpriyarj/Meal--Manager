/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import auth from '@react-native-firebase/auth';
import {ErrorMessage, Formik} from 'formik';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
const Schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});
const ForgotPassword = props => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(false);

  return (
    <>
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
          }}>
          <View style={styles.main}>
            <Image
              style={styles.image}
              source={require('./../../assets/meal.png')}
            />
            <Formik
              initialValues={{email: ''}}
              validationSchema={Schema}
              onSubmit={async ({email, password}) => {
                setLoading(true);
                // console.log(values);
                try {
                  await auth().sendPasswordResetEmail(email);
                  ToastAndroid.show(
                    'Reset link sent to the email.',
                    ToastAndroid.SHORT,
                  );
                  props.navigation.replace('signin');
                  setLoading(false);
                } catch (err) {
                  console.log('err', err);
                  switch (err.code) {
                    case 'auth/user-not-found':
                      ToastAndroid.show(
                        'Account does not exist. Please sign up',
                        ToastAndroid.SHORT,
                      );
                      break;

                    default:
                      ToastAndroid.show(
                        'Something went wrong',
                        ToastAndroid.SHORT,
                      );
                      break;
                  }

                  setLoading(false);
                }
              }}>
              {({handleChange, handleBlur, handleSubmit, values}) => (
                <>
                  <View
                    style={
                      {
                        // backgroundColor: '#111',
                      }
                    }>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons
                        name="email"
                        style={{fontSize: 30, padding: 10}}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder={'Enter E-Mail'}
                        placeholderTextColor="#00000064"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        underlineColorAndroid="transparent"
                      />
                    </View>
                    <ErrorMessage name="email">
                      {msg => <Text style={styles.errorMsg}>{msg}</Text>}
                    </ErrorMessage>
                  </View>

                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={e => {
                      if (!loading) {
                        handleSubmit(e);
                      }
                    }}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{fontSize: 16, color: '#111'}}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </Formik>

            <View style={{marginTop: 10}}>
              <TouchableOpacity
                style={{fontSize: 16}}
                onPress={() => props.navigation.replace('signin')}>
                <Text
                  style={{color: '#ff8f00', alignSelf: 'center', fontSize: 16}}>
                  Go back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
  image: {
    marginTop: 50,
    resizeMode: 'stretch',
    alignSelf: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  errorMsg: {
    color: '#dd0000',
    width: '100%',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Georgia',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 5,
    height: 50,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#d3d3d3',
  },
  textInput: {
    alignSelf: 'center',
    height: 50,
    width: '100%',
    color: '#000',
    padding: 10,
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    overflow: 'scroll',
  },
  buttonStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: 150,
    height: 45,
    fontWeight: '600',
    backgroundColor: '#ff8f00',
    fontSize: 16,
    marginTop: 20,
    borderRadius: 5,
  },
});

export default ForgotPassword;
