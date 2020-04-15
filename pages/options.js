import React, { useState } from 'react';
import { AsyncStorage, View } from 'react-native';
import { Button, Snackbar, TextInput, ToggleButton } from 'react-native-paper';
import Header from '../components/header';

let focusListener = null;
let blurListener = null;

export default function Options(props) {
  const [visible, setVisible] = useState(false);
  const [unity, setUnity] = useState('kg');
  const [exoBreak, setExoBreak] = useState('180');
  const [setBreak, setSetBreak] = useState('120');
  const load = () => {
    AsyncStorage.getItem('OPTIONS', (err, result) => {
      if (result && result.length) {
        const options = JSON.parse(result);
        setUnity(options.unity ? options.unity : 'kg');
        setExoBreak(options.exoBreak ? options.exoBreak : '180');
        setSetBreak(options.setBreak ? options.setBreak : '120');
      }
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
    setVisible(false);
    setUnity('kg');
    setExoBreak('180');
    setSetBreak('120');
  });

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
