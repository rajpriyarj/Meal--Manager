import {addDays, formatISO} from 'date-fns';
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {FirebaseContext} from '../../App';
import firestore from '@react-native-firebase/firestore';
import {Formik} from 'formik';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
function StudentDashboard() {
  const user = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);
  const [pref, setPref] = useState(null);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection(`hostels/${user.hostelId}/preference`)
      .where('email', '==', user.email)
      .where(
        'date',
        '==',
        formatISO(addDays(new Date(), 1), {
          representation: 'date',
        }),
      )
      .onSnapshot(
        snapshot => {
          console.log('snapshot', snapshot);
          if (snapshot && !snapshot.empty) {
            setPref(snapshot.docs[0].data().meal);
          }
        },
        error => {
          console.log('error', error);
        },
      );
    return () => unsubscribe();
  }, []);
  return (
    <View style={{padding: 10, height: '100%'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={{fontSize: 24}}>Welcome,</Text>
          <Text style={{fontSize: 24}}>{user.name}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => auth().signOut()}>
            <AntDesignIcons name="logout" size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{fontSize: 16, marginVertical: 30}}>
        {pref
          ? `Your meal preference for ${formatISO(addDays(new Date(), 1), {
              representation: 'date',
            })} has been recorded`
          : `Please select your meal preference for ${formatISO(
              addDays(new Date(), 1),
              {
                representation: 'date',
              },
            )}`}
      </Text>

      <View style={{height: '100%'}}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            breakfast: pref ? pref.breakfast : false,
            lunch: pref ? pref.lunch : false,
            snacks: pref ? pref.snacks : false,
            dinner: pref ? pref.dinner : false,
          }}
          // validationSchema={Schema}
          onSubmit={async values => {
            setLoading(true);
            // console.log(values);
            try {
              await firestore()
                .collection(`hostels/${user.hostelId}/preference`)
                .where('email', '==', user.email)
                .where(
                  'date',
                  '==',
                  formatISO(addDays(new Date(), 1), {
                    representation: 'date',
                  }),
                )
                .get()
                .then(snapshot => {
                  console.log('snapshot.empty', snapshot.empty);
                  if (snapshot.empty) {
                    return firestore()
                      .collection(`hostels/${user.hostelId}/preference`)
                      .add({
                        date: formatISO(addDays(new Date(), 1), {
                          representation: 'date',
                        }),
                        email: user.email,
                        meal: values,
                        name: user.name,
                      });
                  } else {
                    return firestore()
                      .doc(
                        `hostels/${user.hostelId}/preference/${snapshot.docs[0].id}`,
                      )
                      .set({meal: values}, {merge: true});
                  }
                });
              setLoading(false);
            } catch (err) {
              console.log('err', err);
              switch (err.code) {
                case 'auth/user-not-found':
                  ToastAndroid.show('Account not found', ToastAndroid.SHORT);
                  break;

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
            dirty,
            setFieldValue,
          }) => (
            <>
              <View style={styles.container}>
                <View style={styles.toggleContainer}>
                  <Text style={styles.label}>Breakfast</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={values.breakfast ? '#0cf' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={newValue => {
                      setFieldValue('breakfast', newValue);
                    }}
                    value={values.breakfast}
                  />
                </View>
                <View style={styles.toggleContainer}>
                  <Text style={styles.label}>Lunch</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={values.lunch ? '#0cf' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={newValue => {
                      setFieldValue('lunch', newValue);
                    }}
                    value={values.lunch}
                  />
                </View>
                <View style={styles.toggleContainer}>
                  <Text style={styles.label}>Snacks</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={values.snacks ? '#0cf' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={newValue => {
                      setFieldValue('snacks', newValue);
                    }}
                    value={values.snacks}
                  />
                </View>
                <View style={styles.toggleContainer}>
                  <Text style={styles.label}>Dinner</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={values.dinner ? '#0cf' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={newValue => {
                      setFieldValue('dinner', newValue);
                    }}
                    value={values.dinner}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={{
                  ...styles.buttonStyle,
                  backgroundColor: !pref || dirty ? '#ff8f00' : '#A0A0A0',
                }}
                onPress={e => {
                  if (!loading) {
                    handleSubmit(e);
                  }
                }}
                disabled={pref && !dirty}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: 150,
    height: 45,
    fontWeight: '600',
    fontSize: 16,
    marginTop: 20,
    borderRadius: 5,
  },
  container: {},
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
    // height: '100%',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    // margin: 8,
    fontSize: 16,
  },
});
export default StudentDashboard;
