import {View, Text, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import Login from '../screens/Auth/Login';
import Home from '../screens/Main/Home';

// Redux
import {useSelector, useDispatch} from 'react-redux';
import {setCurrentUser} from '../redux/currentUserSlice';
import Acquisition from '../screens/Main/Acquisition';
import GainsTax from '../screens/Main/GainsTax';
import AcquisitionChat from '../screens/Main/AcquisitionChat';
import FamilyHouse from '../screens/Main/FamilyHouse';
import RegisterFamilyHouse from '../screens/Main/RegisterFamilyHouse';
import DoneResisterFamilyHouse from '../screens/Main/DoneResisterFamilyHouse';
import DirectRegister from '../screens/Main/DirectRegister';
import RegisterDirectHouse from '../screens/Main/RegisterDirectHouse copy';
import OwnedHouseDetail from '../screens/Main/OwnedHouseDetail';
import SearchAddress from '../screens/Main/SearchAddress';
import OwnedFamilyHouse from '../screens/Main/OwnedFamilyHouse';
import DoneSendFamilyHouse from '../screens/Main/DoneSendFamilyHouse';
import GainsTaxChat from '../screens/Main/GainsTaxChat';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser?.value);

  const horizontalAnimation = {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({current, layouts}) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={horizontalAnimation}>
        {currentUser ? (
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
                headerheaderTitleStyle: {
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 18,
                  color: '#222',
                },
              }}
            />
            <Stack.Screen name="Acquisition" component={Acquisition} />
            <Stack.Screen name="GainsTax" component={GainsTax} />
            <Stack.Screen name="FamilyHouse" component={FamilyHouse} />
            <Stack.Screen
              name="RegisterFamilyHouse"
              component={RegisterFamilyHouse}
            />
            <Stack.Screen
              name="DoneResisterFamilyHouse"
              component={DoneResisterFamilyHouse}
            />
            <Stack.Screen name="DirectRegister" component={DirectRegister} />
            <Stack.Screen
              name="RegisterDirectHouse"
              component={RegisterDirectHouse}
            />
            <Stack.Screen
              name="OwnedHouseDetail"
              component={OwnedHouseDetail}
            />
            <Stack.Screen name="SearchAddress" component={SearchAddress} />
            <Stack.Screen
              name="OwnedFamilyHouse"
              component={OwnedFamilyHouse}
            />
            <Stack.Screen
              name="DoneSendFamilyHouse"
              component={DoneSendFamilyHouse}
            />
            <Stack.Screen name="AcquisitionChat" component={AcquisitionChat} />
            <Stack.Screen name="GainsTaxChat" component={GainsTaxChat} />

            {/* <Stack.Group screenOptions={{presentation: 'modal'}}>
              <Stack.Screen
                name="AcquisitionChat"
                component={AcquisitionChat}
              />
              <Stack.Screen name="GainsTaxChat" component={GainsTaxChat} />
            </Stack.Group> */}
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={Login} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
