import React from 'react';
import { Text, View } from 'react-native';
import Header from '../components/header';

export default function Preview(props) {
  return (
    <View>
      <Header title="Aperçu" navigation={props.navigation} />
      <Text>Aperçu</Text>
    </View>
  )
}
