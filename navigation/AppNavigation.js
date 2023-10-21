import React from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs([
  'Non-serialiizable values were found in the navigation state',
])

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown: false}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation;

const styles = StyleSheet.create({})