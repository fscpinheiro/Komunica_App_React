import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, ScrollView } from 'react-native';
import io from 'socket.io-client';

const App = () => {
  const [actions, setActions] = useState([]);
  const scrollViewRef = useRef();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io('http://10.0.2.2:5000');
    setSocket(socketIo);

    socketIo.on('response', (data) => {
      console.log('Resposta do servidor:', data);
    });

    socketIo.on('action_completed', (data) => {
      console.log('Ação concluída:', data.message);
      setActions((prevActions) => [...prevActions, data.message]);
    });

    socketIo.on('action_failed', (data) => {
      console.log('Ação falhou:', data.message);
      setActions((prevActions) => [...prevActions, data.message]);
    });

    return function cleanup() {
      socketIo.disconnect();
    }
  }, []);

  const handlePress = (action, code) => {
    if (socket) {
      socket.emit('code', code);
      setActions((prevActions) => [...prevActions, action]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Komunica</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Ação 1" onPress={() => handlePress('Ação 1', '#54dfs53f')} />
        <Button title="Ação 2" onPress={() => handlePress('Ação 2', '#28fh392f')} />
        <Button title="Ação 3" onPress={() => handlePress('Ação 3', '#83hd830d')} />
      </View>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        style={styles.listContainer}
      >
        {actions.map((action, index) => (
          <Text key={index}>{action}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleBar: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
});

export default App;