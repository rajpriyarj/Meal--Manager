import React, {useContext} from 'react';
import {Text} from 'react-native';
import {FirebaseContext} from '../App';
import Dashboard from './dashboard';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import Menu from './menu';
import {SUPER_ADMIN, WARDEN} from '../utils/constants';
import Suggestion from './suggestion';
import AddUsers from './user';
function Main(props) {
  const user = useContext(FirebaseContext);
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{activeBackgroundColor: '#0000000f'}}>
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      {user.type !== SUPER_ADMIN ? (
        <Tab.Screen
          name="Menu"
          component={Menu}
          options={{
            tabBarLabel: 'Menu',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="room-service"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : null}
      {user.type !== SUPER_ADMIN ? (
        <Tab.Screen
          name="Suggestion"
          component={Suggestion}
          options={{
            tabBarLabel: 'Suggestion',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="chat" color={color} size={size} />
            ),
          }}
        />
      ) : null}
      {user.type === WARDEN || user.type === SUPER_ADMIN ? (
        <Tab.Screen
          name="Users"
          component={AddUsers}
          options={{
            tabBarLabel: 'Manage',
            tabBarIcon: ({color, size}) => (
              <FontAwesome5Icons name="user-edit" color={color} size={size} />
            ),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
}

export default Main;
