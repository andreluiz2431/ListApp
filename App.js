import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  AsyncStorage,
  StatusBar,
} from 'react-native';
import { Dialog } from 'react-native-simple-dialogs'; // Importando o modal
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Importando ícones
import { styles } from './styles/styles-module.js'; // Importando CSS

export default function App() {
  const [top] = useState(new Animated.Value(50));
  const [height] = useState(new Animated.Value(0));
  const [padding] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));
  let boxConfig = false;

  const [task, setTask] = useState([]); // lista de tasks

  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const [nameEdit, setNameEdit] = useState('');
  const [addressEdit, setAddressEdit] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState({});

  const [isFavoring, setIsFavoring] = useState({});
  const [nameFav, setNameFav] = useState('');
  const [addressFav, setAddressFav] = useState('');

  async function addTask() {
    if (newAddress !== '' || newName !== '') {
      const search = task.filter((task) => task.name === newName);

      if (search.length !== 0) {
        Alert.alert('Atenção', 'Título da tarefa repetido!');
        return;
      }

      setTask([...task, { name: newName, address: newAddress }]);

      setNewAddress('');
      setNewName('');
      Keyboard.dismiss();
    }
  }

  async function removeTask(item) {
    Alert.alert(
      `Excluir tarefa ${item.name}`,
      'Tem certeza que deseja remover esta anotação?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return;
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => setTask(task.filter((tasks) => tasks !== item)),
        },
      ],
      { cancelable: false }
    );
  }

  function editTask(item) {
    setModalVisible(true);
    setIsEditing(item);
    setNameEdit(item.name);
    setAddressEdit(item.address);
  }

  async function updateTask() {
    setModalVisible(false);

    const tempTask = task.filter((tasks) => tasks !== isEditing);

    setTask([...tempTask, { name: nameEdit, address: addressEdit }]);
  }

  async function favoriteTask(item) {
    // fazendo
    setIsFavoring(item);
    setNameFav(item.name);
    setAddressFav(item.address);

    const tempTaskFav = task.filter((tasks) => tasks !== isFavoring);

    setTask([{ name: item.name, address: item.address }, ...tempTaskFav]);
  }

  useEffect(() => {
    async function carregaDados() {
      const task = await AsyncStorage.getItem('task');

      if (task) {
        setTask(JSON.parse(task));
      }
    }
    carregaDados();
  }, []);

  useEffect(() => {
    async function salvaDados() {
      AsyncStorage.setItem('task', JSON.stringify(task));
    }
    salvaDados();
  }, [task]);

  function openModal() {
    if (boxConfig === false) {
      boxConfig = true;

      Animated.sequence([
        Animated.timing(padding, {
          toValue: 20,
          duration: 0,
        }),
        Animated.timing(top, {
          toValue: 0,
          duration: 60,
        }),
        Animated.timing(height, {
          toValue: 200,
        }),
        Animated.timing(opacity, {
          toValue: 1,
        }),
      ]).start();
    } else {
      boxConfig = false;

      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100,
        }),
        Animated.timing(top, {
          toValue: 50,
          duration: 0,
        }),
        Animated.timing(height, {
          toValue: 0,
        }),
        Animated.timing(padding, {
          toValue: 0,
          duration: 0,
        }),
      ]).start();
    }
  }

  async function infoTask(item) {
    Alert.alert(
      item.name,
      `Info: ${item.address}`,
      [
        {
          text: 'OK',
          onPress: () => {
            return;
          },
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="padding"
        style={{ flex: 1 }}
        enabled={Platform.OS === 'ios'}
      >
        <View style={styles.container}>
          <Text style={styles.TituloApp}>List App</Text>
          <Text style={styles.SubTituloApp}>Bah, é o que tem pra hj...</Text>

          <StatusBar backgroundColor="#fff" barStyle="dark-content" />

          <View style={styles.FlatList}>
            {task.map((item) => {
              return (
                <View key={item.name} style={styles.ContainerView}>
                  <TouchableOpacity
                    style={styles.Texto}
                    onPress={() => infoTask(item)}
                  >
                    <Text style={styles.Texto}>{item.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => favoriteTask(item)}>
                    <MaterialIcons name="star" size={25} color="#FF8C00" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editTask(item)}>
                    <MaterialIcons name="edit" size={25} color="#FF8C00" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeTask(item)}>
                    <MaterialIcons name="delete" size={25} color="#FF8C00" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <Dialog visible={modalVisible} title="Editar">
            <View style={styles.FormAdd}>
              <TextInput
                style={styles.Input}
                placeholderTextColor="#999"
                autoCorrect={true}
                placeholder="Novo título"
                onChangeText={(text) => setNameEdit(text)}
                value={nameEdit}
              />
            </View>
            <View style={styles.FormAdd}>
              <TextInput
                style={styles.Input}
                placeholderTextColor="#999"
                autoCorrect={true}
                placeholder="Novo texto"
                onChangeText={(text) => setAddressEdit(text)}
                value={addressEdit}
              />
            </View>
            <View style={styles.FormAdd}>
              <TouchableOpacity
                style={styles.InputButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="ios-close" size={24} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.InputButton}
                onPress={() => updateTask()}
              >
                <Ionicons name="ios-checkmark" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Dialog>

          <View style={styles.ButtonAddAlign}>
            <TouchableOpacity
              style={styles.ButtonAdd}
              onPress={() => openModal()}
            >
              <Ionicons name="ios-add" size={35} color="#FF8C00" />
            </TouchableOpacity>
          </View>
        </View>
        <Animated.View
          style={{
            height: height,
            top: top,
            paddingLeft: padding,
            paddingRight: padding,
            zIndex: 3,
            opacity: opacity,
          }}
        >
          <View style={styles.ModalAdd}>
            <Text style={styles.TituloApp}>Adicione sua tarefa</Text>
            <View style={styles.FormAdd}>
              <TextInput
                style={styles.Input}
                placeholderTextColor="#999"
                autoCorrect={true}
                placeholder="Título"
                onChangeText={(text) => setNewName(text)}
                value={newName}
              />
            </View>

            <View style={styles.FormAdd}>
              <TextInput
                style={styles.Input}
                placeholderTextColor="#999"
                autoCorrect={true}
                placeholder="Info"
                onChangeText={(text) => setNewAddress(text)}
                value={newAddress}
              />
              <TouchableOpacity
                style={styles.InputButton}
                onPress={() => addTask()}
              >
                <Ionicons name="ios-send" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </>
  );
}
