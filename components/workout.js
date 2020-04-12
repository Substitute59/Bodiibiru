import React from 'react';
import { Image, Text } from 'react-native';
import { List } from 'react-native-paper';
import { getFormattedPause } from '../utils/utils';

export default function Workout(props) {
  const exercice = props.exercices && props.exercices.length ? props.exercices.filter(item => item.id === props.item.exercice) : [];

  const styles = {
    thumbnail: {
      width: 40,
      height: 40,
      resizeMode: "contain"
    },
    nothumbnail: {
      width: 40,
      height: 40,
      paddingVertical: 5,
      lineHeight: 15,
      textAlign: 'center',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderWidth: 1
    }
  };

  return exercice && exercice.length ? <List.Item
    title={`${exercice[0].name} :`}
    description={`${props.item.reps}reps@${props.item.weight} R:${getFormattedPause(props.item.pause)}`}
    left={() => exercice[0].image ? <Image
      source={{ uri: exercice[0].image.localUri }}
      style={styles.thumbnail} /> : <Text style={styles.nothumbnail}>Aucune photo</Text>}
  /> : null;
};
