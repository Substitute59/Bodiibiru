import React, { useState } from 'react';
import { AsyncStorage, View } from 'react-native';
import { Button, Snackbar, TextInput, ToggleButton } from 'react-native-paper';
import Header from '../components/header';

export default function Options(props) {
  const setOptions = () => {
    const options = {
      unity: unity,
      exoBreak: exoBreak,
      setBreak: setBreak
    };
    AsyncStorage.setItem('OPTIONS', JSON.stringify(options), () => {
      setVisible(!visible)
    });
  };

  const [visible, setVisible] = useState(false);
  const [unity, setUnity] = useState('');
  const [exoBreak, setExoBreak] = useState('');
  const [setBreak, setSetBreak] = useState('');
  const load = () => {
    AsyncStorage.getItem('OPTIONS', (err, result) => {
      if (result) {
        const options = JSON.parse(result);
        setUnity(options.unity ? options.unity : 'kg');
        setExoBreak(options.exoBreak ? options.exoBreak : 180);
        setSetBreak(options.setBreak ? options.setBreak : 120);
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
    toggleRow: {
      marginBottom: 15
    },
    toggleButton: {
      marginHorizontal: 10,
      borderLeftWidth: 1
    },
    input: {
      width: '80%',
      marginBottom: 15,
      justifyContent: 'center',
      fontSize: 12
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Options" navigation={props.navigation} />
      <View style={styles.main}>
        <ToggleButton.Row
          style={styles.toggleRow}
          onValueChange={value => setUnity(value)}
          value={unity}
        >
          <ToggleButton style={styles.toggleButton} icon="weight-kilogram" value="kg" />
          <ToggleButton style={styles.toggleButton} icon="weight-pound" value="lb" />
        </ToggleButton.Row>
        <TextInput
          keyboardType={'numeric'}
          style={styles.input}
          label='Repos par défaut entre les exercices (en secondes)'
          value={exoBreak}
          onChangeText={text => setExoBreak(text)}
        />
        <TextInput
          keyboardType={'numeric'}
          style={styles.input}
          label='Repos par défaut entre les séries (en secondes)'
          value={setBreak}
          onChangeText={text => setSetBreak(text)}
        />
        <Button style={styles.button} mode="contained" onPress={setOptions}>
          Enregistrer
        </Button>
        <Snackbar
          visible={visible}
          duration={4000}
          onDismiss={() => setVisible(!visible)}
        >
          Options mises à jour !
        </Snackbar>
      </View>
    </View>
  )
}
