import React, { useState } from 'react';
import { AsyncStorage, ScrollView, Text, View } from 'react-native';
import { Button, Dialog, IconButton, List, Portal } from 'react-native-paper';
import Header from '../components/header';
import EditableText from 'react-native-inline-edit';
import PureChart from 'react-native-pure-chart';
import { getFormattedDate } from '../utils/utils';

let focusListener = null;
let blurListener = null;

export default function Max(props) {
  const [exercices, setExercices] = useState(false);
  const [currentExercice, setCurrentExercice] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [line, setLine] = useState(false);
  const [unity, setUnity] = useState('kg');
  const load = () => {
    AsyncStorage.getItem('EXERCICES', (err, result) => {
      if (result && result.length) setExercices(JSON.parse(result));
    });
    AsyncStorage.getItem('OPTIONS', (err, result) => {
      if (result && result.length) {
        const options = JSON.parse(result);
        setUnity(options.unity);
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
    setExercices(false);
    setCurrentExercice(false);
    setVisibleDialog(false);
    setLine(false);
    setUnity('kg');
  });

  const showGraph = exercice => {
    const graphData = [];
    exercice.max.map(item => {
      graphData.push({
        x: getFormattedDate(item.date),
        y: parseInt(item.weight)
      });
    });

    setLine(graphData);
    setCurrentExercice(exercice);
    setVisibleDialog(!visibleDialog);
  };

  const showLine = () => line && line.length ? <PureChart data={line} type='line' /> : <Text>Pas de graphique</Text>;

  const sendText = (exercice, text, old) => {
    if (text && text !== '' && !isNaN(parseInt(text)) && text !== old) {
      const updatedExercices = exercices.map(item => {
        if (item === exercice ) {
          item.max.push({'weight': parseInt(text) + unity, 'date': Date.now()});
        }
        return item;
      });
      AsyncStorage.setItem('EXERCICES', JSON.stringify(updatedExercices));
    }
    load();
  }

  const styles = {
    container: {
      height: '100%'
    },
    main: {
      flexGrow: 1
    },
    noresults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20
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
    name: {
      alignSelf: 'center'
    },
    deleteIcon: {
      alignSelf: 'center'
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Max (1RM)" navigation={props.navigation} />
      { exercices && exercices.length ?
        <ScrollView contentContainerStyle={styles.main}>
          { exercices.map(exercice => {
            return (
              <View key={exercice.id} style={styles.row}>
                <Text style={styles.name}>{ exercice.name }</Text>
                <EditableText
                  text={ exercice.max && exercice.max.length ? exercice.max[exercice.max.length - 1].weight : 'NC' }
                  sendText={text => sendText(exercice, text, exercice.max && exercice.max.length ? exercice.max[exercice.max.length - 1].weight : 'NC')}
                />
                <IconButton
                  style={styles.deleteIcon}
                  icon="chart-line"
                  size={20}
                  onPress={() => showGraph(exercice)} />
              </View>
            )})
          }
        </ScrollView> : <View style={styles.noresults}>
          <Text>Aucun exercice</Text>
        </View> }
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={() => setVisibleDialog(!visibleDialog)}>
          <Dialog.Title>Evolution { currentExercice.name }</Dialog.Title>
          <Dialog.Content>
            <ScrollView horizontal={true}>{ showLine() }</ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleDialog(!visibleDialog)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}
