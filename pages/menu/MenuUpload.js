import {ErrorMessage, Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {FirebaseContext} from '../../App';
const Schema = Yup.object().shape({
  title: Yup.string().required('Required'),
});
function MenuUpload({image, setImage}) {
  const user = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      visible={image !== null}
      onRequestClose={() => {
        setImage(null);
      }}>
      <Formik
        enableReinitialize={true}
        initialValues={{title: '', path: image?.path}}
        validationSchema={Schema}
        onSubmit={values => {
          console.log('values', values, image);
          setLoading(true);
          const now = new Date();
          storage()
            .ref(`/menu/${user.hostelId}/${now.toISOString()}.jpg`)
            .putFile(values.path)
            .then(() =>
              storage()
                .ref(`/menu/${user.hostelId}/${now.toISOString()}.jpg`)
                .getDownloadURL(),
            )
            .then(uri =>
              firestore()
                .collection(`hostels/${user.hostelId}/menu`)
                .add({
                  title: values.title,
                  uri,
                  active: true,
                  firebasePath: `/menu/${
                    user.hostelId
                  }/${now.toISOString()}.jpg`,
                }),
            )
            .then(() => {
              setLoading(false);
              setImage(null);
            })
            .catch(err => {
              switch (err.code) {
                case 'auth/user-not-found':
                  ToastAndroid.show('Account not found', ToastAndroid.SHORT);
                  break;

                default:
                  ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
                  break;
              }

              setLoading(false);
            });
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <>
            <View
              style={{
                padding: 50,
              }}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.tinyLogo}
                source={{
                  uri: values.path,
                }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={'Title'}
                  placeholderTextColor="#00000064"
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                  underlineColorAndroid="transparent"
                />
              </View>
              <ErrorMessage name="title">
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
                  setImage(null);
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

export default MenuUpload;
