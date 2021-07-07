import React, {useContext, useEffect, useState} from 'react';
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
import {BackgroundWaterMark} from '../../component';
import RNPickerSelect from 'react-native-picker-select';
import {SUPER_ADMIN} from '../../utils/constants';

function AddUsers() {
  const user = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);
  const [hostels, setHostels] = useState([]);
  const Schema = Yup.object().shape({
    email: Yup.string().email('Invalid Email').required('Required'),
    name: Yup.string().required('Required'),
    hostelId:
      user.type === SUPER_ADMIN ? Yup.string().required('Required') : null,
    type: user.type === SUPER_ADMIN ? Yup.string().required('Required') : null,
  });
  useEffect(() => {
    let unsubscribe;
    if (user.type === SUPER_ADMIN) {
      unsubscribe = firestore()
        .collection('hostels')
        .onSnapshot(
          snapshot => {
            if (snapshot && !snapshot.empty) {
              let data = [];

              snapshot.forEach(doc => {
                data.push({
                  id: doc.id,
                  value: doc.id,
                  label: doc.data().name,
                });
              });
              setHostels(data);
            } else {
              setHostels([]);
            }
          },
          error => {
            setHostels([]);
          },
        );
    }
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
  return (
    <BackgroundWaterMark>
      <View style={styles.main}>
        <Formik
          initialValues={{email: '', name: '', hostelId: '', type: ''}}
          validationSchema={Schema}
          onSubmit={async ({email, name, hostelId, type}, actions) => {
            setLoading(true);
            // console.log(values);
            try {
              await firestore()
                .doc(`users/${email}`)
                .set(
                  {
                    email,
                    name,
                    isActive: true,
                    createdAt: new Date(),
                    hostelId:
                      user.type === SUPER_ADMIN ? hostelId : user.hostelId,
                    type: user.type === SUPER_ADMIN ? type : 'student',
                  },
                  {merge: true},
                );
              ToastAndroid.show(
                `${user.type === SUPER_ADMIN ? type : 'Student'} Added`,
                ToastAndroid.SHORT,
              );
              actions.resetForm();
              setLoading(false);
            } catch (err) {
              console.log('err', err);
              switch (err.code) {
                default:
                  ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
                  break;
              }

              setLoading(false);
            }
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
          }) => (
            <>
              <View
                style={{
                  width: '100%',
                }}>
                <View style={{width: '100%'}}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={'Enter Name'}
                    placeholderTextColor="#00000064"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    underlineColorAndroid="transparent"
                  />
                  <ErrorMessage name="name">
                    {msg => <Text style={styles.errorMsg}>{msg}</Text>}
                  </ErrorMessage>
                </View>
                <View style={{width: '100%'}}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={'Enter Email'}
                    placeholderTextColor="#00000064"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    underlineColorAndroid="transparent"
                  />
                  <ErrorMessage name="email">
                    {msg => <Text style={styles.errorMsg}>{msg}</Text>}
                  </ErrorMessage>
                </View>
              </View>
              {user.type === SUPER_ADMIN ? (
                <View style={{marginTop: 20}}>
                  <RNPickerSelect
                    // itemKey="value"

                    placeholder={{
                      label: 'Select type...',
                      value: null,
                      color: '#00000064',
                    }}
                    items={[
                      {label: 'Warden', value: 'warden'},
                      {label: 'Manager', value: 'manager'},
                      {label: 'Student', value: 'student'},
                    ]}
                    onValueChange={value => {
                      setFieldValue('type', value);
                    }}
                    style={{
                      ...pickerSelectStyles,
                      iconContainer: {
                        top: 10,
                        right: 12,
                      },
                      placeholder: {
                        color: '#000',
                      },
                      viewContainer: {backgroundColor: '#ffffffcc'},
                      inputAndroidContainer: {backgroundColor: '#ffffffcc'},
                    }}
                    value={values.type}
                    Icon={() => {
                      return (
                        <MaterialCommunityIcons
                          name="menu-down"
                          size={24}
                          color="gray"
                        />
                      );
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{underlineColor: 'yellow'}}
                  />
                </View>
              ) : null}
              {user.type === SUPER_ADMIN ? (
                <View style={{marginTop: 20}}>
                  <RNPickerSelect
                    // itemKey="value"

                    placeholder={{
                      label: 'Select hostel...',
                      value: null,
                      color: '#00000064',
                    }}
                    items={hostels}
                    onValueChange={value => {
                      setFieldValue('hostelId', value);
                    }}
                    style={{
                      ...pickerSelectStyles,
                      iconContainer: {
                        top: 10,
                        right: 12,
                      },
                      placeholder: {
                        color: '#000',
                      },
                      viewContainer: {backgroundColor: '#ffffffcc'},
                      inputAndroidContainer: {backgroundColor: '#ffffffcc'},
                    }}
                    value={values.hostelId}
                    Icon={() => {
                      return (
                        <MaterialCommunityIcons
                          name="menu-down"
                          size={24}
                          color="gray"
                        />
                      );
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{underlineColor: 'yellow'}}
                  />
                </View>
              ) : null}
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
    </BackgroundWaterMark>
  );
}

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
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
export default AddUsers;
