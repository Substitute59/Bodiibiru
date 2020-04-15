import React, { useState } from 'react';
import { AsyncStorage, Image, ScrollView, Text, View } from 'react-native';
import { Button, Dialog, FAB, IconButton, List, Modal, Portal } from 'react-native-paper';
import Header from '../components/header';
import NewExercice from '../modals/newExercice';

let focusListener = null;
let blurListener = null;

export default function Exercices(props) {
  const [exercices, setExercices] = useState(false);
  const [currentExercice, setCurrentExercice] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const load = () => {
    AsyncStorage.getItem('EXERCICES', (err, result) => {
      if (result && result.length) setExercices(JSON.parse(result));
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
    setExercices(false);
    setCurrentExercice(false);
    setVisible(false);
    setVisibleDialog(false);
  });

  const confirmDeleteExercice = exercice => {
    setCurrentExercice(exercice);
    setVisibleDialog(!visibleDialog);
  };

  const deleteExercice = exercice => {
    setExercices(exercices.filter(item => item !== exercice));
    AsyncStorage.setItem('EXERCICES', JSON.stringify(exercices.filter(item => item !== exercice)));
    setVisibleDialog(!visibleDialog);
    load();
  }

  const styles = {
    container: {
      height: '100%'
    },
    main: {
      flex: 1
    },
    noresults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    },
    thumbnail: {
      width: 70,
      height: 70,
      resizeMode: "contain"
    },
    nothumbnail: {
      width: 70,
      height: 70,
      paddingVertical: 10,
      lineHeight: 25,
      textAlign: 'center',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderWidth: 1
    },
    deleteIcon: {
      alignSelf: 'center'
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Exercices" navigation={props.navigation} />
      { exercices && exercices.length ?
        <View style={styles.main}>
          <ScrollView contentContainerStyle={styles.main}>
            { exercices.map(exercice => {
              return (
                <View key={exercice.id}>
                  <List.Item
                    title={exercice.name}
                    left={() => exercice.image ? <Image
                      source={{ uri: exercice.image.localUri }}
                      style={styles.thumbnail} /> : <Text style={styles.nothumbnail}>Aucune photo</Text>}
                    right={() => <IconButton
                      style={styles.deleteIcon}
                      icon="delete"
                      size={20}
                      onPress={() => confirmDeleteExercice(exercice)} />}
                  />
                </View>
              )})
            }
          </ScrollView>
        </View> : <View style={styles.noresults}>
          <Text>Aucun exercice</Text>
        </View>
      }
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={styles.modal}>
          <NewExercice setVisible={setVisible} visible={visible} load={load} />
        </Modal>
      </Portal>
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={() => setVisibleDialog(!visibleDialog)}>
          <Dialog.Title>Êtes vous certain ?</Dialog.Title>
          <Dialog.Content>
            <Text>Supprimer cet exercice ({ currentExercice.name }) ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleDialog(!visibleDialog)}>Annuler</Button>
            <Button onPress={() => deleteExercice(currentExercice)}>Confirmer</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => setVisible(!visible)}
      />
    </View>
  )
}
