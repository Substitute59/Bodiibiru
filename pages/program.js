import React, { useState, useEffect } from 'react';
import { AsyncStorage, Image, ScrollView, Text, View } from 'react-native';
import { Button, Dialog, FAB, IconButton, Modal, Snackbar, TextInput, Title } from 'react-native-paper';
import Header from '../components/header';
import NewWorkout from '../modals/newWorkout';
import Workout from '../components/workout';
import { Audio } from 'expo-av';
import { useKeepAwake } from 'expo-keep-awake';

const beep = new Audio.Sound();
const beepbeepbeep = new Audio.Sound();
beep.loadAsync(require('../assets/sounds/beep.mp3'));
beepbeepbeep.loadAsync(require('../assets/sounds/beepbeepbeep.mp3'));

let focusListener = null;
let blurListener = null;

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time - mins * 60;
    return { mins: formatNumber(mins), secs: formatNumber(secs) };
}

export default function Program(props) {
  const [exercices, setExercices] = useState(false);
  const [options, setOptions] = useState(false);
  const [program, setProgram] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [reps, setReps] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [showError, setShowError] = useState(false);
  const [step, setStep] = useState('begin');
  const [secondsRemaining, setSecondsRemaining] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { mins, secs } = getRemaining(secondsRemaining);
  const load = () => {
    AsyncStorage.getItem(props.navigation.state.params.programName, (err, result) => {
      if (result) {
        const currentProgram = JSON.parse(result);
        setProgram(currentProgram);
        if (currentProgram.workouts && currentProgram.workouts.length) {
          const nextWorkout = currentProgram.workouts.filter(item => item.id === currentProgram.nextWorkout + 1);
          setCurrentWorkout(nextWorkout[0]);
          setCurrentSet(0);
          setStep('begin');
        }
      }
    });
    AsyncStorage.getItem('EXERCICES', (err, result) => {
      if (result) setExercices(JSON.parse(result));
    });
    AsyncStorage.getItem('OPTIONS', (err, result) => {
      if (result) setOptions(JSON.parse(result));
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
    setOptions(false);
    setProgram(false);
    setCurrentWorkout(false);
    setCurrentSet(0);
    setReps('');
    setVisible(false);
    setVisibleSnack(false);
    setVisibleDialog(false);
    setShowError(false);
    setStep('begin');
    setSecondsRemaining(false);
    setIsActive(false);
  });

  const beginWorkout = () => {
    setStep('exercice');
  };

  const success = () => {
    if (currentWorkout.sets[currentSet + 1]) {
      const currentExercice = currentWorkout.sets[currentSet].exercice;
      if (currentExercice === currentWorkout.sets[currentSet + 1].exercice) {
        setSecondsRemaining(currentWorkout.sets[currentSet].pause);
      } else {
        setSecondsRemaining(options.exoBreak);
      }
      setCurrentSet(currentSet + 1);
      setStep('pause');
      setIsActive(true);
    } else {
      end();
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        if (secondsRemaining <= 5 && secondsRemaining > 1) {
          beep.stopAsync();
          beep.playAsync();
        } else if (secondsRemaining === 1) {
          beepbeepbeep.playAsync();
        }
        setSecondsRemaining(secondsRemaining - 1);
      }, 1000);
    } else {
      stopChrono();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const stopChrono = () => {
    setSecondsRemaining(0);
    setIsActive(false);
    if (step !== 'begin') setStep('exercice');
  };

  const fail = () => {
    setVisibleDialog(true);
  };

  const updateProgram = () => {
    if (reps) {
      setShowError(false);
      program.workouts = program.workouts.map(wo => {
        if (wo.id === currentWorkout.id) {
          wo.sets = wo.sets.map((item, index) => {
            if (index === currentSet) {
              item.reps = reps;
            }
            return item;
          });
        }
        return wo;
      });
      success();
      setVisibleDialog(false);
    } else {
      setShowError(true);
    }
  };

  const end = () => {
    setStep('end');
    program.nextWorkout = program.nextWorkout + 1;
    AsyncStorage.getItem('PROGRAMS', (err, result) => {
      if (result) {
        const allPrograms = JSON.parse(result).map(prog => {
          if (prog.id === program.id) {
            prog.nextWorkout = program.nextWorkout;
          }
          return prog;
        });
        AsyncStorage.setItem('PROGRAMS', JSON.stringify(allPrograms));
      }
    });
    program.workouts = program.workouts.map(wo => {
      if (wo.id === currentWorkout.id) {
        wo.done = true;
        wo.date = Date.now();
      }
      return wo;
    });
    AsyncStorage.setItem(props.navigation.state.params.programName, JSON.stringify(program));
    setTimeout(() => {
      load();
    }, 10000);
  }

  const renderSet = () => {
    const exercice = exercices && exercices.length ? exercices.filter(item => item.id === currentWorkout.sets[currentSet].exercice) : [];

    return exercice && exercice.length ? <View>
      <Title style={styles.title}>{ exercice[0].name }</Title>
      <Image
        source={{ uri: exercice[0].image.localUri }}
        style={styles.thumbnail} />
      <Text style={styles.infosExercice}>{currentWorkout.sets[currentSet].reps}reps@{currentWorkout.sets[currentSet].weight}</Text>
    </View> : null;
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
    scroll: {
      flex: 1
    },
    set: {
      flex: 1,
      justifyContent: 'center'
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
    title: {
      textAlign: 'center',
      marginVertical: 10
    },
    titleEnd: {
      fontSize: 30
    },
    button: {
      marginVertical: 15,
      width: 200,
      alignSelf: 'center'
    },
    buttonLarge: {
      marginVertical: 15,
      width: 250,
      alignSelf: 'center'
    },
    buttonSet: {
      marginVertical: 5,
      width: 200,
      alignSelf: 'center'
    },
    thumbnail: {
      width: 200,
      height: 200,
      resizeMode: "contain",
      alignSelf: 'center'
    },
    infosExercice: {
      fontSize: 20,
      alignSelf: 'center',
      marginVertical: 15
    },
    buttonsTimer: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 15
    },
    chrono: {
      fontSize: 50,
      alignSelf: 'center',
      marginBottom: 15
    },
    buttonTime: {
      marginHorizontal: 5
    },
    input: {
      marginTop: 15
    },
    error: {
      color: 'red'
    },
    close: {
      position: 'absolute',
      right: 10,
      top: 7
    }
  };

  useKeepAwake();

  return (
    <View style={styles.container}>
      <Header title={ program ? program.name : 'Programme' } navigation={props.navigation} />
      {currentWorkout ? (
        <View style={styles.scroll}>
          {step === 'begin' ? (
            <View style={styles.scroll}>
              <Title style={styles.title}>Séance du jour</Title>
              <ScrollView contentContainerStyle={styles.scroll}>
                { currentWorkout.sets && currentWorkout.sets.length ? currentWorkout.sets.map((item, index) => <Workout key={index} item={item} exercices={exercices} />): null }
              </ScrollView>
              <Button style={styles.button} icon="timer" mode="contained" onPress={() => beginWorkout()}>
                Commencer
              </Button>
            </View>
          ) : null }
          {step === 'exercice' ? (
            <View style={styles.set}>
              { renderSet() }
              <Button style={styles.buttonSet} icon="check" mode="contained" onPress={() => success()}>
                Succès
              </Button>
              <Button style={styles.buttonSet} icon="close" mode="outlined" onPress={() => fail()}>
                Echec
              </Button>
            </View>
          ) : null }
          {step === 'pause' ? (
            <View style={styles.set}>
              <Text style={styles.chrono}>{secondsRemaining >= 0 ? `${mins}min${secs}` : ''}</Text>
              <View style={styles.buttonsTimer}>
                <Button style={styles.buttonTime} mode="outlined" onPress={() => setSecondsRemaining(secondsRemaining - 15)}>
                  -15s
                </Button>
                <Button style={styles.buttonTime} mode="contained" onPress={() => stopChrono()}>
                  Passer
                </Button>
                <Button style={styles.buttonTime} mode="outlined" onPress={() => setSecondsRemaining(secondsRemaining + 15)}>
                  +15s
                </Button>
              </View>
            </View>
          ) : null }
          {step === 'end' ? (
            <View style={styles.set}>
              <Title style={[styles.title, styles.titleEnd]}>Bravo !!</Title>
              <Button style={styles.buttonLarge} mode="contained" icon="clipboard-text" onPress={() => props.navigation.navigate("Workouts", { programName: program.name + program.id, workoutId: currentWorkout.id})}>
                Résumé de la séance
              </Button>
              <Button style={styles.buttonLarge} mode="outlined" icon="home" onPress={() => props.navigation.navigate("Home")}>
                Retour à l'accueil
              </Button>
            </View>
          ) : null }
          <IconButton
            style={styles.close}
            icon="close"
            size={20}
            onPress={() => props.navigation.navigate("Home")}
          />
        </View>
      ) : (
        <View style={styles.main}>
          <Text>Aucune séance programmée</Text>
        </View>
      )}
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => setVisible(!visible)}
      />
      <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={styles.modal}>
        <NewWorkout
          setVisible={setVisible}
          setVisibleSnack={setVisibleSnack}
          visible={visible}
          load={load}
          exercices={exercices}
          program={program}
          options={options} />
      </Modal>
      <Snackbar
        visible={visibleSnack}
        duration={4000}
        onDismiss={() => setVisibleSnack(!visibleSnack)}
      >
        Séries ajoutées à la séance
      </Snackbar>
      <Dialog
          visible={visibleDialog}
          onDismiss={() => setVisibleDialog(!visibleDialog)}>
        <Dialog.Title>Echec</Dialog.Title>
        <Dialog.Content>
          <Text>Combien de répétitions ont été réalisées ?</Text>
          <TextInput
            keyboardType={'numeric'}
            style={styles.input}
            label='Reps'
            value={reps}
            onChangeText={text => setReps(text)}
          />
          {showError ? <Text style={styles.error}>Remplissez le nombre de répétitions</Text> : null }
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisibleDialog(!visibleDialog)}>Annuler</Button>
          <Button onPress={() => updateProgram()}>Confirmer</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}
