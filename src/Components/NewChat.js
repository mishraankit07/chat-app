import React, { useState } from 'react';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

const ariaLabel = { 'aria-label': 'description' };


export default function NewChat({ userData, recieverEmail, getChatDocId, checkDocExists }) {

    const [latestChat, setLatestChat] = useState('');


    const handleSendClick = async () => {

        if (userData) {

            console.log("sending data");
            let userEmail1 = 'abc@abc.com';
            // changed here
            let userEmail2 = 'shyam@shyam.com';

            let chatDocId = getChatDocId(userEmail1, userEmail2);

            let docExists = await checkDocExists(chatDocId);
            let firstTimeChat = !docExists;

            // console.log("first time chat:",firstTimeChat);
                async function addChat() {
                    const chatRef = doc(db, "chats", chatDocId);

                    // if not the first time chat then update the document
                    if (firstTimeChat == false) {
                        let chatData = { sender: userData.email, message: latestChat };
                        await updateDoc(chatRef, {
                            messages: arrayUnion(chatData)
                        });
                    }

                    // create a document
                    else {

                        let val = userEmail1.localeCompare(userEmail2);
                        let lowerEmail = userEmail1, higherEmail = userEmail2;

                        if (val >= 0) {
                            lowerEmail = userEmail2;
                            higherEmail = userEmail1;
                        }

                        let chatDocument = { messages: [{ sender: userEmail1, message: latestChat }], userEmail1: lowerEmail, userEmail2: higherEmail };
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
            <TextField
                value={latestChat}
                placeholder='Enter your message'
                inputProps={ariaLabel}
                onChange={(e) => setLatestChat(e.target.value)} />
            <SendIcon
                onClick={handleSendClick}
            />
        </div>
    )
}