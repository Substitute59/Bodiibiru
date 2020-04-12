import React, { useState } from 'react';
import { AsyncStorage, ScrollView, Text, View } from 'react-native';
import { Button, Dialog, IconButton, List } from 'react-native-paper';
import Header from '../components/header';
import EditableText from 'react-native-inline-edit';
import PureChart from 'react-native-pure-chart';

export default function Max(props) {
  const [exercices, setExercices] = useState(false);
  const [currentExercice, setCurrentExercice] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [line, setLine] = useState(false);
  const [unity, setUnity] = useState('');
  const load = () => {
    AsyncStorage.getItem('EXERCICES', (err, result) => {
      if (result) setExercices(JSON.parse(result));
    });
    AsyncStorage.getItem('OPTIONS', (err, result) => {
      if (result) {
        const options = JSON.parse(result);
        setUnity(options.unity);
      }
    });
  };

  props.navigation.addListener('didFocus', () => {
    load();
  });

  const showGraph = exercice => {
    const graphData = [];
    exercice.max.map(item => {
      graphData.push({
        x: new Intl.DateTimeFormat('fr-FR').format(item.date),
        y: parseInt(item.weight)
      });
    });

    setLine(graphData);
    setCurrentExercice(exercice);
    setVisibleDialog(!visibleDialog);
  };

  const showLine = () => line ? <PureChart data={line} type='line' /> : <Text>Pas de graphique</Text>;

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
      flex: 1
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
      <View style={styles.main}>
        <ScrollView contentContainerStyle={styles.main}>
          { exercices ? exercices.map(exercice => {
            return (
              <View key={exercice.id}>
                <List.Item
                  title={<EditableText
                    text={ exercice.max && exercice.max.length ? exercice.max[exercice.max.length - 1].weight : 'NC' }
                    sendText={text => sendText(exercice, text, exercice.max && exercice.max.length ? exercice.max[exercice.max.length - 1].weight : 'NC')}
                  />}
                  left={() => <Text style={styles.name}>{ exercice.name }</Text>}
                  right={() => <IconButton
                    style={styles.deleteIcon}
                    icon="chart-line"
                    size={20}
                    onPress={() => showGraph(exercice)} />}
                />
              </View>
            )
          }) : <Text>Aucun exercice</Text> }
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
        </ScrollView>
      </View>
    </View>
  )
}
