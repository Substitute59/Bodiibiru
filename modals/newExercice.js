import React, { useState } from 'react';
import { AsyncStorage, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, IconButton, Text, TextInput, Title } from 'react-native-paper';

export default function NewExercice(props) {
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showError, setShowError]= useState(false);

  const openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  }

  const renderImage = () => {
    if (selectedImage && selectedImage.localUri) {
        return (
          <Image
            source={{ uri: selectedImage.localUri }}
            style={styles.thumbnail} />
        );
    } else {
      return <Text>Aucune photo</Text>;
    }
  }

  const setExercice = () => {
    if (name) {
      setShowError(false);
      AsyncStorage.getItem('EXERCICES', (err, result) => {
        let exercices = result ? JSON.parse(result) : [];
        const id = exercices.length ? exercices[exercices.length - 1].id + 1 : 1;
        const currentExercice = {
          'id': id,
          'name': name,
          'image': selectedImage,
          'max': []
        };
        exercices.push(currentExercice);
        AsyncStorage.setItem('EXERCICES', JSON.stringify(exercices));
        props.setVisible(!props.visible);
        props.load();
      });
    } else {
      setShowError(true);
    }
  };

  const styles = {
    container: {
      padding: 15,
      backgroundColor: "#fff"
    },
    input: {
      marginVertical: 15
    },
    thumbnail: {
      width: 150,
      height: 150,
      resizeMode: "contain"
    },
    error: {
      color: 'red',
      marginBottom: 15
    }
  };

  return (
    <View style={styles.container}>
      <Title>Nouvel exercice</Title>
      <Text>Photo</Text>
      <IconButton
        icon="camera"
        size={20}
        onPress={() => openImagePickerAsync()}
      />
      <View>{ renderImage() }</View>
      <TextInput
        style={styles.input}
        label='Nom'
        value={name}
        onChangeText={text => setName(text)}
      />
      {showError ? <Text style={styles.error}>Remplissez le nom</Text> : null }
      <Button mode="contained" onPress={setExercice}>
        Créer
      </Button>
    </View>
  )
}
