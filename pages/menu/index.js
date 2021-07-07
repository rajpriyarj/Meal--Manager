import React, {useEffect, useState} from 'react';
import {useContext} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {FirebaseContext} from '../../App';
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';
import ImageView from 'react-native-image-viewing';
import MenuUpload from './MenuUpload';
import storage from '@react-native-firebase/storage';
import {MANAGER, STUDENT} from '../../utils/constants';

function ListEmpty() {
  return (
    <Text style={{textAlign: 'center', paddingVertical: 30}}>
      No menu found
    </Text>
  );
}

function MenuHeading() {
  return <Text style={{fontSize: 24}}>Menu</Text>;
}
function FlatListItemSeparator() {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#c8c7cc',
      }}
    />
  );
}

function Menu() {
  const [viewImageIndex, setViewImageIndex] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const user = useContext(FirebaseContext);
  const [menuItems, setMenuItems] = useState(null);
  const deleteItem = (id, path) => {
    firestore().collection(`hostels/${user.hostelId}/menu`).doc(id).delete();
    if (path) {
      storage().ref(path).delete();
    }
  };
  const showAlert = (id, path) =>
    Alert.alert(
      'Delete Menu photo',
      'Are you sure you wanna delete?',
      [
        {
          text: 'Yes',
          onPress: () => deleteItem(id, path),
          style: 'default',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );

  const toggleActive = (id, active) => {
    firestore()
      .collection(`hostels/${user.hostelId}/menu`)
      .doc(id)
      .set({active}, {merge: true});
  };

  useEffect(() => {
    const unsubscribe = (user.type !== MANAGER
      ? firestore()
          .collection(`hostels/${user.hostelId}/menu`)
          .where('active', '==', true)
      : firestore().collection(`hostels/${user.hostelId}/menu`)
    ).onSnapshot({
      error: e => {
        console.log('e', e);
      },
      next: querySnapshot => {
        const items = [];

        querySnapshot.forEach(documentSnapshot => {
          items.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
            key: documentSnapshot.id,
            index: items.length,
          });
        });

        setMenuItems(items);
      },
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  if (menuItems === null) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <FlatList
        // numColumns={3}
        data={menuItems}
        ItemSeparatorComponent={FlatListItemSeparator}
        // style={{flexDirection: 'column'}}
        renderItem={({item}) => (
          <View
            style={{
              flex: 1,
              display: 'flex',
              paddingHorizontal: 20,
              paddingVertical: 20,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setViewImageIndex(item.index);
              }}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.tinyLogo}
                source={{
                  uri: item.uri,
                }}
              />
            </TouchableOpacity>
            <View>
              <Text style={{fontSize: 16, padding: 5}}>{item.title}</Text>
            </View>
            {user.type !== STUDENT ? (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <View style={{marginHorizontal: 20}}>
                  <Button
                    title={item.active ? 'Hide' : 'Show'}
                    onPress={() => {
                      toggleActive(item.id, item.active ? false : true);
                    }}
                  />
                </View>
                <View style={{marginHorizontal: 20}}>
                  <Button
                    title="Delete"
                    color="red"
                    onPress={() => {
                      showAlert(item.id, item.firebasePath);
                    }}
                  />
                </View>
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={ListEmpty}
        ListHeaderComponent={MenuHeading}
        // ListFooterComponent={MenuFooting}
        ListHeaderComponentStyle={{
          alignSelf: 'center',
        }}
      />
      {user.type !== STUDENT ? (
        <ActionButton buttonColor="rgba(231,76,60,1)" useNativeFeedback={true}>
          <ActionButton.Item
            useNativeFeedback={true}
            buttonColor="#9b59b6"
            title="Gallery"
            onPress={() => {
              ImagePicker.openPicker({
                mediaType: 'photo',
                cropping: true,
                multiple: false,
                freeStyleCropEnabled: true,
              }).then(image => {
                setImageUpload(image);
              });
            }}>
            <MaterialCommunityIcons
              name="image"
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>

          <ActionButton.Item
            useNativeFeedback={true}
            buttonColor="#1abc9c"
            title="Camera"
            onPress={() => {
              ImagePicker.openCamera({
                mediaType: 'photo',
                cropping: true,
                multiple: false,
                freeStyleCropEnabled: true,
              }).then(image => {
                setImageUpload(image);
              });
            }}>
            <MaterialCommunityIcons
              name="camera"
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
        </ActionButton>
      ) : null}

      <ImageView
        images={menuItems}
        imageIndex={viewImageIndex}
        visible={viewImageIndex !== null}
        onRequestClose={() => setViewImageIndex(null)}
      />
      <MenuUpload image={imageUpload} setImage={setImageUpload} />
    </>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').width * 0.75,
    borderRadius: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
export default Menu;
