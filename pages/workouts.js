import React, { useState } from 'react';
import { AsyncStorage, ScrollView, Text, View } from 'react-native';
import { Button, Dialog, IconButton, List } from 'react-native-paper';
import Header from '../components/header';
import Workout from '../components/workout';
import { getFormattedDate } from '../utils/utils';

let focusListener = null;
let blurListener = null;

export default function Workouts(props) {
  const [program, setProgram] = useState(false);
  const [workout, setWorkout] = useState(false);
  const [exercices, setExercices] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const load = () => {
    AsyncStorage.getItem(props.navigation.state.params.programName, (err, result) => {
      if (result) {
        const currentProgram = JSON.parse(result);
        setProgram(currentProgram);
        const currentWorkoutId = props.navigation.state.params.workoutId;
        if (currentWorkoutId) {
          const currentWorkout = currentProgram.workouts.filter(wo => wo.id === currentWorkoutId);
          setWorkout(currentWorkout[0]);
          setVisibleDialog(!visibleDialog);
        }
      }
    });
    AsyncStorage.getItem('EXERCICES', (err, result) => {
      if (result) setExercices(JSON.parse(result));
    });
  };

  if (focusListener != null && focusListener.remove) {
    focusListener.remove();
  }
  focusListener = props.navigation.addListener('didFocus', () => {
    load();
  });

  if (blurListener != null && blurListener.remove) {
    blurListener.remove();
  }
  blurListener = props.navigation.addListener('willBlur', () => {
    setProgram(false);
    setWorkout(false);
    setExercices(false);
    setVisibleDialog(false);
  });

  const showWorkout = (wo) => {
    setWorkout(wo);
    setVisibleDialog(!visibleDialog);
  };

  const styles = {
    container: {
      height: '100%'
    },
    scroll: {
      flex: 1
    },
    eyeIcon: {
      alignSelf: 'center'
    },
    scrollDialog: {
      maxHeight: 344
    }
  };

  return (
    <View style={styles.container}>
      <Header title={ program ? program.name : 'Séance' } navigation={props.navigation} />
      <View style={styles.scroll}>
        {program.workouts && program.workouts.length ? (
          <ScrollView contentContainerStyle={styles.scroll}>
            { program.workouts.map((wo, index) => {
              return wo.done ? (
                <List.Item
                  key={index}
                  title={`Séance du ${ getFormattedDate(wo.date) }`}
                  right={() => <IconButton
                    style={styles.eyeIcon}
                    icon="eye"
                    size={20}
                    onPress={() => showWorkout(wo)} />}
                />
              ) : null;
            }) }
          </ScrollView>
        ) : null}
      </View>
      <Dialog
        visible={visibleDialog}
        onDismiss={() => setVisibleDialog(!visibleDialog)}>
        <Dialog.Title>Aperçu de la séance</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={styles.scrollDialog}>
            { workout.sets && workout.sets.length ? workout.sets.map((item, index) => <Workout key={index} item={item} exercices={exercices} />): null }
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisibleDialog(!visibleDialog)}>Fermer</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}
