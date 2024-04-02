import React, { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import io from "socket.io-client";

const App = () => {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketInstance = io("http://192.168.0.10:3001");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const socketInstance = io("http://192.168.0.10:3001");
    socketInstance.on("send", (data: any) => {
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("send");
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.messageList}
        data={receivedMessages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default App;
