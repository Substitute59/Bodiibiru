import React, { useState } from 'react';
import { AsyncStorage, ScrollView, Text, View } from 'react-native';
import { Button, Dialog, IconButton, Menu, TextInput, Title } from 'react-native-paper';
import Workout from '../components/workout';

export default function NewWorkout(props) {
  const setWorkout = () => {
    if(exercice && sets && reps && weight && pause) {
      setShowError(false);
      for (let i = 0; i < sets; i++) {
        workouts.push(
          {
            exercice: exercice.id,
            reps,
            weight: weight + props.options.unity,
            pause
          }
        )
      }
      props.setVisibleSnack(true);
    } else {
      setShowError(true);
    }
  };

  const finishWorkout = () => {
    const newProgram = props.program;
    let id = newProgram.workouts && newProgram.workouts.length ? newProgram.workouts[newProgram.workouts.length - 1].id : 0;
    id++;
    newProgram.workouts.push({
      id,
      sets: workouts,
      done: false
    });
    AsyncStorage.setItem(newProgram.name + newProgram.id, JSON.stringify(newProgram));
    props.setVisible(!props.visible);
    props.load();
  };

  const [exercice, setExercice] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [pause, setPause] = useState(props.options.setBreak);
  const [visible, setVisible] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [showError, setShowError]= useState(false);

  const styles = {
    container: {
      padding: 15,
      backgroundColor: "#fff"
    },
    title: {
      marginBottom: 10
    },
    input: {
      marginBottom: 15
    },
    chevron: {
      position: 'absolute',
      right: 0,
      top: 0,
      margin: 0,
      height: '100%',
      width: '100%',
      alignItems: 'flex-end',
      paddingRight: 10
    },
    scroll: {
      maxHeight: 344
    },
    error: {
      color: 'red',
      marginBottom: 15
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Nouvelle séance</Title>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(!visible)}
        anchor={
          <View>
            <TextInput
              dense={true}
              style={styles.input}
              label='Exercice'
              value={exercice.name || ''}
            />
            <IconButton
              style={styles.chevron}
              icon="chevron-down"
              size={30}
              onPress={() => setVisible(!visible)} />
          </View>
        }
      >
        { props.exercices ? props.exercices.map(exercice => {
            return (
              <Menu.Item key={exercice.id} onPress={() => {
                setExercice({id: exercice.id, name: exercice.name});
                setVisible(!visible);
              }} title={exercice.name} />
            )
          }) : null }
      </Menu>
      <TextInput
        dense={true}
        keyboardType={'numeric'}
        style={styles.input}
        label='Séries'
        value={sets}
        onChangeText={text => setSets(text)}
      />
      <TextInput
        dense={true}
        keyboardType={'numeric'}
        style={styles.input}
        label='Répétitions'
        value={reps}
        onChangeText={text => setReps(text)}
      />
      <TextInput
        dense={true}
        keyboardType={'numeric'}
        style={styles.input}
        label={`Poids (en ${props.options.unity})`}
        value={weight}
        onChangeText={text => setWeight(text)}
      />
      <TextInput
        dense={true}
        keyboardType={'numeric'}
        style={styles.input}
        label='Repos (en secondes)'
        value={pause}
        onChangeText={text => setPause(text)}
      />
      {showError ? <Text style={styles.error}>Remplissez les champs</Text> : null }
      <Button mode="contained" style={styles.input} onPress={setWorkout}>
        Ajouter
      </Button>
      <Button mode="outlined" style={styles.input} onPress={finishWorkout}>
        Terminer
      </Button>
      <Button mode="text" onPress={() => setVisibleDialog(!visibleDialog)}>
        Aperçu
      </Button>
      <Dialog
        visible={visibleDialog}
        onDismiss={() => setVisibleDialog(!visibleDialog)}>
        <Dialog.Title>Aperçu de la séance</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={styles.scroll}>
            { workouts && workouts.length ? workouts.map((item, index) => <Workout key={index} item={item} exercices={props.exercices} />): null }
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisibleDialog(!visibleDialog)}>Fermer</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}
