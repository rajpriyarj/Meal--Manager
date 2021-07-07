import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {FirebaseContext} from '../../App';
import firestore from '@react-native-firebase/firestore';
import {STUDENT} from '../../utils/constants';
import {FlatListItemSeparator} from '../../component';

function Suggestion({item}) {
  const user = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);
  return (
    <View
      key={item.id}
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginVertical: 10,
      }}>
      <Text style={{fontSize: 20, textAlign: 'left', fontWeight: '800'}}>
        {item.subject}
      </Text>
      <Text style={{marginVertical: 10}}>{item.suggestion}</Text>
      <Text style={{textAlign: 'right', width: '100%'}}>{item.name}</Text>
      {user.type !== STUDENT ? (
        <View style={{justifyContent: 'flex-end', marginTop: 10}}>
          <View style={{}}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                setLoading(true);
                firestore()
                  .doc(`hostels/${user.hostelId}/suggestions/${item.id}`)
                  .set(
                    {
                      isSeen: true,
                    },
                    {merge: true},
                  )
                  .then(() => {
                    setLoading(false);
                  });
              }}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{fontSize: 16, color: '#111'}}>Mark as seen</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}
function ManagerSuggestion() {
  const [suggestions, setSuggestions] = useState([]);
  const user = useContext(FirebaseContext);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection(`hostels/${user.hostelId}/suggestions`)
      .where('isSeen', '==', false)
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
            setSuggestions(data);
          } else {
            setSuggestions([]);
          }
        },
        error => {
          console.log('error', error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <SafeAreaView>
      <FlatList
        ItemSeparatorComponent={FlatListItemSeparator}
        style={{padding: 25}}
        data={suggestions}
        renderItem={({item}) => <Suggestion key={item.id} item={item} />}
      />
    </SafeAreaView>
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
    backgroundColor: '#0cf',
    fontSize: 16,
    marginTop: 20,
    borderRadius: 5,
  },
});
export default ManagerSuggestion;
