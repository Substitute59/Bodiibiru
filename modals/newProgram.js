import React, { useState } from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';

export default function NewProgram(props) {
  const setProgram = () => {
    if (name) {
      setShowError(false);
      AsyncStorage.getItem('PROGRAMS', (err, result) => {
        let programs = result ? JSON.parse(result) : [];
        const id = programs.length ? programs[programs.length - 1].id + 1 : 1;
        const currentProgram = {
          'id': id,
          'name': name,
          'nextWorkout': 0,
          'workouts': []
        };
        programs.push(currentProgram);
        AsyncStorage.setItem('PROGRAMS', JSON.stringify(programs));
        const programName = name + id;
        AsyncStorage.setItem(programName, JSON.stringify(currentProgram));
        props.setVisible(!props.visible);
        props.load();
      });
    } else {
      setShowError(true);
    }
  };

  const [name, setName] = useState('');
  const [showError, setShowError]= useState(false);

  const styles = {
    container: {
      padding: 15,
      backgroundColor: "#fff"
    },
    input: {
      marginVertical: 15
    },
    error: {
      color: 'red',
      marginBottom: 15
    }
  };

  return (
    <View style={styles.container}>
      <Title>Nouveau programme</Title>
      <TextInput
        style={styles.input}
        label='Nom'
        value={name}
        onChangeText={text => setName(text)}
      />
      {showError ? <Text style={styles.error}>Remplissez le nom</Text> : null }
      <Button mode="contained" onPress={setProgram}>
        Créer
      </Button>
    </View>
  )
}
