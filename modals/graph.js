import React from 'react';
import { Text, View } from 'react-native';
import Header from '../components/header';

export default function Graph(props) {
  return (
    <View>
      <Header title="Graphique" navigation={props.navigation} />
      <Text>Graphique</Text>
    </View>
  )
}
