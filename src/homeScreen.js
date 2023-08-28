import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import React from 'react';

export default function HomeScreen({callBackFunction}) {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={callBackFunction}
        style={{backgroundColor: 'lightblue', padding: 15}}>
        <Text>Open The Modal</Text>
      </TouchableOpacity>
    </View>
  );
}
