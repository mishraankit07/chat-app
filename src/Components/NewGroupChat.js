import React, { useState, useContext,useEffect } from 'react';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '../Context/AuthContext';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

const ariaLabel = { 'aria-label': 'description' };

export default function NewGroupChat({ userData, groupChatData, getGroupChatDocId}) {

    let [latestChat, setLatestChat] = useState('');
    const { getTimeStamp } = useContext(AuthContext);

    // ram@ram.com#@!ram@ram.com#@!shyam@shyam.com#@!sita@sita.com 
    const handleSendClick = async() => {
        if (userData && groupChatData) {

            let groupChatDocId=groupChatData.groupName;
            let emailsList=groupChatData.userEmails.sort();
            for(let i=0;i<emailsList.length;i++){
                groupChatDocId=groupChatDocId+'#@!'+emailsList[i];
            }

            console.log("groupChatDocId:",groupChatDocId);

            console.log("updating a chat document:");
            let id = uuidv4();
           
            const groupChatRef = doc(db, "groups", groupChatDocId);

            let chatData = { sender: userData.email, message: latestChat, id: id, createdAt: getTimeStamp() };
            await updateDoc(groupChatRef, {
                messages: arrayUnion(chatData),
                recieversRead: []
            });

            setLatestChat('');
        }
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
        </div>);
}