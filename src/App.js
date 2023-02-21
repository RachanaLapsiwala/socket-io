import './App.css';
import { useEffect, useState } from "react"
import io from "socket.io-client";
import Chat from './Chat';
import axios from "axios";
const serverUrl = 'localhost:4000'
const socket = io(serverUrl);
function App() {


  const [username, setUserName] = useState("");
  const [password, setpassword] = useState("")
  const [showChat, setShowChat] = useState(false);
  const [data, setdata] = useState("")
  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      const newUser = {
        username: username,
        password: password
      }
      await axios.post('http://localhost:4000/api/userapi/create', newUser)
      socket.on("order-added", newUser);
      setShowChat(true)
      // setdata(newUser)
    }
  }
 
  return (
    <div className="App">
      {
        !showChat ? (
          <div className='joinChatContainer'>
            <h3>Join A Chat</h3>
            <input type="text" placeholder="John.." onChange={(e) => setUserName(e.target.value)} />
            <select onChange={(e) => setpassword(e.target.value)}>
              <option>-- Select Room --</option>
              <option value='javascript'>JavaScript</option>
              <option value='node'>Node</option>
              <option value='express'>Express</option>
              <option value='react'>React</option>
            </select>
            {/* <input type="text" placeholder="Romm ID...." onChange={(e) => setpassword(e.target.value)} /> */}
            <button onClick={handleMessageSend}>Join a Room</button>
          </div>)
          :
          (<Chat
            socket={socket}
            username={username}
            room={password} />)
      }


    </div>
  );
}

export default App;
