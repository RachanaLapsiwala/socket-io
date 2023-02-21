import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';

const Chat = ({ socket, username, room }) => {

    const [currentMessage, setcurrentMessage] = useState("");
    const [messageList, setsendMessageList] = useState([]);
    const [showdata, setshowdata] = useState(false);
    const [id1,setbyid] = useState(0)
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const MessageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":"
                    + new Date(Date.now()).getMinutes()
            }
            await axios.post("http://localhost:4000/api/chat/create/", MessageData);
            socket.emit("send_message", MessageData)
            setcurrentMessage("")
        }
       
    }
    const editMessage = async (id) => {
        if (showdata === true) {
                const MessageData = {
                    room: room,
                    author: username,
                    message: currentMessage,
                    time: new Date(Date.now()).getHours() + ":"
                    + new Date(Date.now()).getMinutes()
                }
                let res = await axios.patch(`http://localhost:4000/api/chat/update/${id}`, MessageData);
                fetchall();
                setshowdata(false)
                setcurrentMessage("")
                // socket.emit("send_message", MessageData)

            }
        }
    const fetchall = async () => {
        const response = await axios.post("http://localhost:4000/api/chat/getAll/", { username })
        setsendMessageList(response.data)
        return response
    }
    const fetchbyid = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/chat/getbyid/${id}`);
        setcurrentMessage(response.data[0].message)
        setbyid(id);
        setshowdata(true);
    }
    useEffect(() => {
        fetchall()
        socket.on("recieve_message", (data) => {
            setsendMessageList((list) => [...list, data])
        })

    }, [socket])
    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat</p>
            </div>
            <div className='chat-body'>
                {messageList.map((messageContent) => {
                    return (
                        <div className="message"
                            id={username === messageContent.author ? "you" : "other"}
                            onClick={() => fetchbyid(messageContent.id)}
                        >

                            <div>
                                <div className="message-content" tabIndex={0}>
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                    );

                })}
            </div>
            <div className='chat-footer'>
                <input type="text" placeholder="hey" onChange={(e) => { setcurrentMessage(e.target.value) }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}

                    value={currentMessage ? currentMessage : ""}
                />
                {!showdata ?(<button onClick={() => {
                     sendMessage(); 
                }}>&#9658;</button>):(<button onClick={() => {
                    editMessage(id1);
                    
               }}>&#9658;</button>)}
            </div>
        </div>
    )
}

export default Chat;