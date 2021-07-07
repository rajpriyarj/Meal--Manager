import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {FirebaseContext} from '../../App';
import RNPickerSelect from 'react-native-picker-select';
import {addDays, formatISO} from 'date-fns';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
function ManagerDashboard() {
  const user = useContext(FirebaseContext);
  const [date, setDate] = useState();
  const [stats, setStats] = useState({
    breakfast: 0,
    lunch: 0,
    snacks: 0,
    dinner: 0,
  });
  console.log('stats', stats);

  const calculateStats = data => {
    setStats(() => {
      return data.reduce(
        (prev, cur) => {
          return {
            breakfast: prev.breakfast + (cur.meal.breakfast ? 1 : 0),
            lunch: prev.lunch + (cur.meal.lunch ? 1 : 0),
            snacks: prev.snacks + (cur.meal.snacks ? 1 : 0),
            dinner: prev.dinner + (cur.meal.dinner ? 1 : 0),
          };
        },
        {breakfast: 0, lunch: 0, snacks: 0, dinner: 0},
      );
    });
  };
  const dates = useMemo(() => {
    return Array(7)
      .fill()
      .map((_, i) => {
        const dateISO = formatISO(addDays(new Date(), i - 5), {
          representation: 'date',
        });
        return {label: dateISO, value: dateISO};
      });
  }, []);
  useEffect(() => {
    let unsubscribe;
    if (date) {
      unsubscribe = firestore()
        .collection(`hostels/${user.hostelId}/preference`)
        .where('date', '==', date)
        .onSnapshot(
          snapshot => {
            console.log('snapshot', snapshot);
            if (snapshot && !snapshot.empty) {
              let data = [];

              snapshot.forEach(doc => {
                data.push({
                  id: doc.id,
                  ...doc.data(),
                });
              });
              console.log('data', data);
              calculateStats(data);
            } else {
              calculateStats([]);
            }
          },
          error => {
            console.log('error', error);
          },
        );
    }
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [date]);
  console.log('dates', dates);
  return (
    <View style={{padding: 20}}>
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
      <View style={{marginTop: 20}}>
        <Text>Select Date:</Text>
        <RNPickerSelect
          // itemKey="value"

          placeholder={{
            label: 'Select date...',
            value: null,
            color: '#9EA0A4',
          }}
          items={dates}
          onValueChange={setDate}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 10,
              right: 12,
            },
            placeholder: {
              color: '#000',
            },
            viewContainer: {backgroundColor: '#fff'},
            modalViewBottom: {backgroundColor: '#fff'},
            modalViewMiddle: {backgroundColor: '#fff'},
            inputAndroidContainer: {backgroundColor: '#fff'},
          }}
          value={date}
          Icon={() => {
            return (
              <MaterialCommunityIcons name="menu-down" size={24} color="gray" />
            );
          }}
          useNativeAndroidPickerStyle={false}
          textInputProps={{underlineColor: 'yellow'}}
        />
      </View>
      {date ? (
        <View style={{flexGrow: 1, alignItems: 'center', marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                marginRight: 5,
                backgroundColor: '#ffffffee',
                padding: 20,
                borderRadius: 10,
                flexGrow: 1,
                flex: 1,
              }}>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 24}}>Breakfast</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <FontAwesomeIcons name="users" size={24} color="gray" />
                </View>
                <View>
                  <Text style={{fontSize: 24, marginLeft: 10}}>
                    {stats.breakfast}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginRight: 5,
                backgroundColor: '#ffffffee',
                padding: 20,
                borderRadius: 10,
                flexGrow: 1,
                flex: 1,
              }}>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 24}}>Lunch</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <FontAwesomeIcons name="users" size={24} color="gray" />
                </View>
                <View>
                  <Text style={{fontSize: 24, marginLeft: 10}}>
                    {stats.lunch}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View
              style={{
                marginRight: 5,
                backgroundColor: '#ffffffee',
                padding: 20,
                borderRadius: 10,
                flexGrow: 1,
                flex: 1,
              }}>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 24}}>Snacks</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <FontAwesomeIcons name="users" size={24} color="gray" />
                </View>
                <View>
                  <Text style={{fontSize: 24, marginLeft: 10}}>
                    {stats.snacks}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginRight: 5,
                backgroundColor: '#ffffffee',
                padding: 20,
                borderRadius: 10,
                flexGrow: 1,
                flex: 1,
              }}>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 24}}>Dinner</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <FontAwesomeIcons name="users" size={24} color="gray" />
                </View>
                <View>
                  <Text style={{fontSize: 24, marginLeft: 10}}>
                    {stats.dinner}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
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
export default ManagerDashboard;
