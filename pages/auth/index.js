import SignIn from './SignIn';
import SignUp from './SignUp';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ForgotPassword from './ForgotPassword';

function Auth() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="signin">
      <Stack.Screen
        name="signin"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="signup"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="forgot_pass"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Auth;
