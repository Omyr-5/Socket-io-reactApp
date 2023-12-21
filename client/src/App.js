import './App.css';
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [inputValue, setInputValue] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [room, setRoom] = useState()
  const [joinStatus, setJoinStatus] = useState()

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room)

    }
  }

  const sendMessage = () => {
    socket.emit("send_message", {
      message: inputValue,
      room
    });
    setInputValue("");
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMessages(prevMessages => [...prevMessages, data]);
    });

    socket.on("message_history", (data) => {
      setReceivedMessages(data);
    });
    socket.on("status", (data) => {
      setJoinStatus(data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("status");
    };
  }, []);

  console.log(joinStatus)

  return (
    <div className="App">
      <input
        type="number"
        placeholder="room id"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>join room</button>
      <input
        type="text"
        placeholder="message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div style={{ display: "flex", flexDirection: "column" }}>

        <b> {joinStatus}</b> has joined the room
        <p>Received Messages:</p>
        {receivedMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
