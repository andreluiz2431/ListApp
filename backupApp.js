import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  alert,
  Alert,
  AsyncStorage,
} from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState('');

  async function addTask() {
    if (newTask === '') {
      return;
    }

    const search = task.filter((task) => task === newTask);

    if (search.length !== 0) {
      Alert.alert('Atenção', 'Nome da tarefa repetido!');
      return;
    }

    setTask([...task, newTask]);
    setNewTask('');
    Keyboard.dismiss();
  }

  async function removeTask(item) {
    Alert.alert(
      'Deletar Task',
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

  function addTaskPer(valor) {
    if (valor === '') {
      return;
    }

    const search = task.filter((task) => task === valor);

    if (search.length !== 0) {
      Alert.alert('Atenção', 'Nome da tarefa repetido!');
      return;
    }

    setTask([...task, valor]);
    setNewTask('');
  }

  async function checkedTask(item) {
    Alert.alert(
      'Mais detalhes',
      item,
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
          onPress: () => {
            // falta remover item anterior
            addTaskPer(`Checked -> ${item}`);
          },
        },
      ],
      { cancelable: false }
    );
  }

  useEffect(() => {
    Alert.alert(
      'Olá',
      'Seja bem vindo ao app de listas! Liste suas compras ou afazeres do dia.'
    );

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

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="padding"
        style={{ flex: 1 }}
        enabled={Platform.OS === 'ios'}
      >
        <View style={styles.container}>
          <View style={styles.Body}>
            <Text style={styles.TituloApp}>ListAPP</Text>
            <FlatList
              style={styles.FlatList}
              data={task}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => checkedTask(item)}>
                  <View style={styles.ContainerView}>
                    <Text style={styles.Texto}>{item}</Text>
                    <TouchableOpacity onPress={() => removeTask(item)}>
                      <MaterialIcons name="delete" size={25} color="#FF8C00" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.Form}>
            <TextInput
              style={styles.Input}
              placeholderTextColor="#999"
              autoCorrect={true}
              placeholder="Adicione uma tarefa"
              onChangeText={(text) => setNewTask(text)}
              value={newTask}
            />
            <TouchableOpacity style={styles.Button} onPress={() => addTask()}>
              <Ionicons name="ios-add" size={25} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  Body: {
    flex: 1,
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  Input: {
    flex: 1,
    height: 40,
    overflow: 'scroll',
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    borderRadius: 4,
    marginLeft: 10,
  },
  FlatList: {
    flex: 1,
    marginTop: 5,
  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: '#eee',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
  Texto: {
    width: '80%',
    height: 20,
    overflow: 'scroll',
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
    //textAlign: 'center',
  },
  TituloApp: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
});
