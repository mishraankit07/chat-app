import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { CircularProgress, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../Context/AuthContext';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Styles/Room.css';

const ariaLabel = { 'aria-label': 'description' };

export default function Room() {

    console.log("user params:", useParams());
    const roomId = useParams().id;
    const userName = useParams().name;

    const [message, setMessage] = useState('');
    const [chatData, setChatData] = useState(null);
    const { getTimeStamp } = useContext(AuthContext);

    const [activeUsers, setActiveUsers] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!roomId || !userName) {
            navigate('/rooms');
        }
    }, [])

    useEffect(() => {
        async function getData() {
            const docRef = doc(db, "rooms", roomId);
            onSnapshot(docRef, (res) => {
                // console.log("current room chats:", res.data());
                // console.log("users inside:", res.data().usersIn);
                setChatData(res.data());

                let activeUsersTemp = [];
                res.data().messages.map((msgObj) => {
                    if (activeUsersTemp.includes(msgObj.sender) == false) {
                        activeUsersTemp.push(msgObj.sender);
                    }
                })

                setActiveUsers(activeUsersTemp);
            })
        }

        getData();
        // console.log("chat data users in:",chatData.usersIn);
    }, [userName, roomId])

    const handleSendClick = async () => {
        // console.log("updating a chat document:");
        let id = uuidv4();
        let chatData = { sender: userName, message: message, id: id, createdAt: getTimeStamp() };
        const chatRef = doc(db, "rooms", roomId);
        await updateDoc(chatRef, {
            messages: arrayUnion(chatData)
        });
        setMessage('');
    }

    return (
        <div style={{ width: "90vw", height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className='room-chat-cont'>
                <div className='room-chats-cont'>
                    {
                        chatData == null ? <CircularProgress /> :
                            chatData.messages.map((chatObj) => (
                                (chatObj.sender == userName ?
                                    <div className='room-chat sender'>
                                        <div className='name'>
                                            you
                                        </div>
                                        <div className='message'>
                                            {chatObj.message}
                                        </div>
                                    </div> :
                                    <div className='room-chat reciever'>
                                        <div className='name'>
                                            {chatObj.sender}
                                        </div>
                                        <div className='message'>
                                            {chatObj.message}
                                        </div>
                                    </div>
                                )
                            ))
                    }
                </div>
                <div className='room-new-chat-cont'>
                    <TextField className='room-new-chat-text'
                        value={message}
                        placeholder='Enter your message'
                        inputProps={ariaLabel}
                        onChange={(e) => setMessage(e.target.value)} />
                    <SendIcon className='send-icon'
                        onClick={handleSendClick}
                    />
                </div>
            </div>
        </div>);
}