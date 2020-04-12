import React from 'react';
import { Text, View } from 'react-native';
import Header from '../components/header';

export default function EditReps(props) {
  return (
    <View>
      <Header title="Editer les reps" navigation={props.navigation} />
      <Text>Editer les reps</Text>
    </View>
  )
}
