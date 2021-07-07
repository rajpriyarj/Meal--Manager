import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import ActionButton from 'react-native-action-button';
import {FirebaseContext} from '../../App';
import {FlatListItemSeparator} from '../../component';
import AddHostel from './AddHostelModal';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
function SuperAdminDashboard() {
  const user = useContext(FirebaseContext);
  const [hostels, setHostels] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let unsubscribe;
    unsubscribe = firestore()
      .collection('hostels')
      .onSnapshot(
        snapshot => {
          if (snapshot && !snapshot.empty) {
            let data = [];

            snapshot.forEach(doc => {
              data.push({
                id: doc.id,
                ...doc.data(),
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
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
  return (
    <View style={{padding: 20, flex: 1}}>
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

      <View style={{flexGrow: 1, marginTop: 20}}>
        <FlatList
          ListHeaderComponent={() => (
            <Text style={{fontSize: 24, textAlign: 'center', marginBottom: 10}}>
              Hostels
            </Text>
          )}
          //   ItemSeparatorComponent={FlatListItemSeparator}
          //   style={{padding: 25}}
          data={hostels}
          renderItem={({item, index}) => {
            return (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  //   marginVertical: 10,
                  //   borderBottomWidth: 1,
                  //   borderTopWidth: 1,
                  backgroundColor: index % 2 === 0 ? '#ececec' : '#fff',
                  borderBottomWidth: 1,
                }}>
                <Text>{item.name}</Text>
              </View>
            );
          }}
        />
      </View>
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        useNativeFeedback={true}
        onPress={() => {
          setOpen(true);
        }}
      />
      <AddHostel open={open} setOpen={setOpen} />
    </View>
  );
}
export default SuperAdminDashboard;
