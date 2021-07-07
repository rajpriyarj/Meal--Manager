import firestore from '@react-native-firebase/firestore';
import {ErrorMessage, Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
import {FirebaseContext} from '../../App';
const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
});
function AddHostel({open, setOpen}) {
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      visible={open}
      onRequestClose={() => {
        setOpen(false);
      }}>
      <Formik
        enableReinitialize={true}
        initialValues={{name: ''}}
        validationSchema={Schema}
        onSubmit={async values => {
          setLoading(true);
          try {
            await firestore().collection('hostels').add({
              name: values.name,
              active: true,
            });
            setLoading(false);
            setOpen(false);
          } catch (error) {
            console.log('error', error);
            ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
            setLoading(false);
            setOpen(false);
          }
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <>
            <View
              style={{
                padding: 50,
              }}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={'Name'}
                  placeholderTextColor="#00000064"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  underlineColorAndroid="transparent"
                />
              </View>
              <ErrorMessage name="name">
                {msg => <Text style={styles.errorMsg}>{msg}</Text>}
              </ErrorMessage>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingHorizontal: 50,
                justifyContent: 'center',
              }}>
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
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={e => {
                  e.preventDefault();
                  setOpen(false);
                }}>
                <Text style={{fontSize: 16, color: '#111'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </Modal>
  );
}

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
    width: 100,
    height: 45,
    fontWeight: '600',
    backgroundColor: '#ff8f00',
    fontSize: 16,
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  tinyLogo: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').width * 0.75,
    borderRadius: 10,
  },
});

export default AddHostel;
