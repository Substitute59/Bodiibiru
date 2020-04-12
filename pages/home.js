import React, { useState } from 'react';
import { AsyncStorage, Text, View } from 'react-native';
import { Button, Dialog, IconButton, Modal, FAB } from 'react-native-paper';
import Header from '../components/header';
import NewProgram from '../modals/newProgram';

let focusListener = null;
let blurListener = null;

export default function Home(props) {
  const [programs, setPrograms] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const load = () => {
    AsyncStorage.getItem('PROGRAMS', (err, result) => {
      if (result) setPrograms(JSON.parse(result));
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
    setPrograms(false);
    setCurrentProgram(false);
    setVisible(false);
    setVisibleDialog(false);
  });

  const confirmDeleteProgram = program => {
    setCurrentProgram(program);
    setVisibleDialog(!visibleDialog);
  };

  const deleteProgram = program => {
    setPrograms(programs.filter(item => item !== program));
    AsyncStorage.setItem('PROGRAMS', JSON.stringify(programs.filter(item => item !== program)));
    AsyncStorage.removeItem(program.anme + program.id);
    setVisibleDialog(!visibleDialog);
  }

  const styles = {
    container: {
      height: '100%'
    },
    main: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonsContainer: {
      flexDirection: 'row'
    },
    button: {
      marginVertical: 10
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
      <Header title="Bodiibiru" navigation={props.navigation} />
      <View style={styles.main}>
        { programs ? programs.map(program => {
          return (
            <View key={program.id} style={styles.buttonsContainer}>
              <Button style={styles.button} icon="clipboard-text" mode="outlined" onPress={() => props.navigation.navigate("Program", { programName: program.name + program.id})}>
                { program.name }
              </Button>
              <Button style={styles.button} icon="delete" mode="text" onPress={() => confirmDeleteProgram(program)}>
                &nbsp;
              </Button>
            </View>
          )
        }) : <Text>Aucun programme</Text> }
        <FAB
          style={styles.fab}
          small
          icon="plus"
          onPress={() => setVisible(!visible)}
        />
        <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={styles.modal}>
          <NewProgram setVisible={setVisible} visible={visible} load={load} />
        </Modal>
        <Dialog
            visible={visibleDialog}
            onDismiss={() => setVisibleDialog(!visibleDialog)}>
          <Dialog.Title>Êtes vous certain ?</Dialog.Title>
          <Dialog.Content>
            <Text>Supprimer ce programme ({ currentProgram.name }) ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleDialog(!visibleDialog)}>Annuler</Button>
            <Button onPress={() => deleteProgram(currentProgram)}>Confirmer</Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </View>
  )
}
