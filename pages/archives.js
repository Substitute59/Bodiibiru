import React, { useState } from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import Header from '../components/header';

export default function Archives(props) {
  const [programs, setPrograms] = useState(false);
  const load = () => {
    AsyncStorage.getItem('PROGRAMS', (err, result) => {
      if (result) {
        const allPrograms = JSON.parse(result);
        setPrograms(allPrograms.filter(item => item.nextWorkout !== 0));
      }
    });
  };

  props.navigation.addListener('didFocus', () => {
    load();
  });

  const styles = {
    container: {
      height: '100%'
    },
    main: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      margin: 10
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    modal: {
      width: '90%',
      marginLeft: '5%'
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Historique" navigation={props.navigation} />
      <View style={styles.main}>
        { programs && programs.length ? programs.map(program => {
          return (
            <Button key={program.id} style={styles.button} icon="clipboard-text" mode="outlined" onPress={() => props.navigation.navigate("Workouts", { programName: program.name + program.id})}>
              { program.name }
            </Button>
          )
        }) : <Text>Aucune séance archivée</Text> }
      </View>
    </View>
  )
}
