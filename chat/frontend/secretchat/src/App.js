import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";

const CryptoJS = require("crypto-js");
const sharedKey = "secret key 123";

// Encrypt
const encryptText = (msg) => CryptoJS.AES.encrypt(msg, sharedKey).toString();

// Decrypt
const decryptText = (msg) => {
  const bytes = CryptoJS.AES.decrypt(msg, sharedKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const socket = io.connect("http://localhost:8000");
const userName = nanoid(4);

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendChat = () => {
    let msg = encryptText(message);
    socket.emit("chat", { message: msg, userName });
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload]);
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Secret-Chat</h1>
        {chat &&
          chat.map((el, i) => {
            return (
              <p key={i}>
                <span>{el.userName}</span>: {decryptText(el.message)}
              </p>
            );
          })}
        <div>
          <input
            type="text"
            name="chat"
            placeholder="send message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendChat}>Send</button>
        </div>
      </header>
    </div>
  );
}

export default App;
