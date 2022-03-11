import React, { useState,useContext } from 'react';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';
import './Styles/NewChat.css';
import { AuthContext } from '../Context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const ariaLabel = { 'aria-label': 'description' };


export default function NewChat({ userData, recieverEmail, getChatDocId, checkDocExists }) {

    const [latestChat, setLatestChat] = useState('');
    const {getTimeStamp}=useContext(AuthContext);

    const handleSendClick = async () => {

        if (userData && recieverEmail) {

            console.log("sending data");
            let userEmail1 = userData.email;
            // changed here
            let userEmail2 = recieverEmail;

            console.log("user data:", userData);
            console.log("reciever data:", recieverEmail);

            let chatDocId = getChatDocId(userEmail1, userEmail2);

            let docExists = await checkDocExists(chatDocId);
            let firstTimeChat = !docExists;

            // console.log("first time chat:",firstTimeChat);
            async function addChat() {
                const chatRef = doc(db, "chats", chatDocId);

                // if not the first time chat then update the document
                if (firstTimeChat == false) {
                    let id = uuidv4();
                    let chatData = { sender: userData.email, message: latestChat, id: id,createdAt:getTimeStamp() };
                    await updateDoc(chatRef, {
                        messages: arrayUnion(chatData),
                    });
                }

                // create a document
                else {
                    let id = uuidv4();
                    let chatDocument = { messages: [{ sender: userEmail1, message: latestChat, id: id }], userEmails: [userEmail1, userEmail2], createdAt:getTimeStamp() };
                    console.log("chat document:", chatDocument);
                    await setDoc(chatRef, chatDocument);
                }
                setLatestChat('');
            }

            addChat();
        }

        // user id 1 user id 2
        // let docId=userId1 + '#@!' + userId2;
        // if no chat exists between user id 1 and user id 2
        // create an empty document
        // data to store={sender : user id 1, message: latest chat}
        // db.chats.doc(docId).set({
        //    chats: [...chats,data to store]
        // })

        // 
    }


    return (
        <div className='new-chat-cont'>
            <TextField className='new-chat-text'
                value={latestChat}
                placeholder='Enter your message'
                inputProps={ariaLabel}
                size='small'
                onChange={(e) => setLatestChat(e.target.value)} />
            <SendIcon className='send-icon'
                onClick={handleSendClick}
            />
        </div>
    )
}