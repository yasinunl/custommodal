import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from './homeScreen';
import SettingsScreen from './settingsScreen';
import Modal from './modal';
import {NavigationContainer} from '@react-navigation/native';
import { View } from 'react-native';

const Tab = createMaterialBottomTabNavigator();

export default function Navigator() {
  const [showModal, setShowModal] = React.useState(false);
  const callBackFunction = React.useCallback(() => {
    setShowModal(prev => !prev);
  }, [showModal]);
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home">
          {props => (
            <HomeScreen callBackFunction={callBackFunction} {...props} />
          )}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {props => (
            <SettingsScreen callBackFunction={callBackFunction} {...props} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
        {showModal && <Modal showModal={showModal} callBackFunction={callBackFunction} />}
    </NavigationContainer>
  );
}
