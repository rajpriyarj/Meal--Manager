/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  useColorScheme,
  Platform,
} from 'react-native';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {FirebaseContext} from '../../App';
const Schema = Yup.object().shape({
  subject: Yup.string().required('Required'),
  suggestion: Yup.string().min(10, 'Too Short!').required('Required'),
});
const StudentSuggestion = props => {
  const [loading, setLoading] = useState(false);
  const user = useContext(FirebaseContext);

  return (
    <>
      <SafeAreaView style={{height: '100%'}}>
        <View style={styles.main}>
          <Formik
            initialValues={{subject: '', suggestion: ''}}
            validationSchema={Schema}
            onSubmit={async ({subject, suggestion}, actions) => {
              setLoading(true);
              // console.log(values);
              try {
                await firestore()
                  .collection(`hostels/${user.hostelId}/suggestions`)
                  .add({
                    name: user.name,
                    email: user.email,
                    subject,
                    suggestion,
                    isSeen: false,
                    createdAt: new Date(),
                  });
                ToastAndroid.show('Suggestion sent', ToastAndroid.SHORT);
                actions.resetForm();
                setLoading(false);
              } catch (err) {
                console.log('err', err);
                switch (err.code) {
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
                  style={{
                    // backgroundColor: '#111',

                    width: '100%',
                  }}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={'Enter Subject'}
                    placeholderTextColor="#00000064"
                    onChangeText={handleChange('subject')}
                    onBlur={handleBlur('subject')}
                    value={values.subject}
                    underlineColorAndroid="transparent"
                  />
                  <ErrorMessage name="subject">
                    {msg => <Text style={styles.errorMsg}>{msg}</Text>}
                  </ErrorMessage>
                  <TextInput
                    style={{
                      ...styles.textInput,
                    }}
                    placeholder={'Enter Suggestion'}
                    multiline={true}
                    placeholderTextColor="#00000064"
                    value={values.suggestion}
                    onChangeText={handleChange('suggestion')}
                    onBlur={handleBlur('suggestion')}
                    numberOfLines={10}
                  />
                  <ErrorMessage name="suggestion">
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
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },

  errorMsg: {
    color: '#dd0000',
    width: '100%',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    fontFamily: 'Georgia',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#d3d3d3',
  },
  textInput: {
    backgroundColor: '#ffffffcc',
    color: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    width: '100%',
    fontSize: 16,
    marginTop: 10,
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

export default StudentSuggestion;
