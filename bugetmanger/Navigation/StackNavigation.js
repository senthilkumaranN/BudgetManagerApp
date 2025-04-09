import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import StatsScreen from '../Screens/StatsScreen';
import AccountsScreen from '../Screens/AccountsScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import CreateExpense from '../Screens/CreateExpense';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTab() {
    return (
      <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 90,
          paddingTop:10,
          elevation: 5,
        }}}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="shuffle-outline" size={30} color={'#E97451'} />
              ) : (
                <Ionicons name="shuffle-outline" size={30} color={'#A0A0A0'} />
              ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons
                  name="bar-chart-outline"
                  size={30}
                  color={'#E97451'}
                />
              ) : (
                <Ionicons
                  name="bar-chart-outline"
                  size={30}
                  color={'#A0A0A0'}
                />
              ),
          }}
        />
        <Tab.Screen
          name="Accounts"
          component={AccountsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="card-outline" size={30} color={'#E97451'} />
              ) : (
                <Ionicons name="card-outline" size={30} color={'#A0A0A0'} />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons
                  name="person-outline"
                  size={30}
                  color={'#E97451'}
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={30}
                  color={'#A0A0A0'}
                />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="createNav"
          component={CreateExpense}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default StackNavigation;
