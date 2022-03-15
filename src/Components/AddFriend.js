import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import './Styles/AddFriend.css';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Button from '@mui/material/Button';
import { db } from '../firebase';
import './Styles/AddFriend.css';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from '@mui/material';
import { AuthContext } from '../Context/AuthContext';

export default function AddFriend({ userData, getChatDocId, friendChats, selectChat }) {

    const [searchEmail, setSearchEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { getTimeStamp } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleEmailType = (val) => {
        setSearchEmail(val);
    }

    const handleSubmitClick = (async () => {

        setLoading(true);

        let userEmail1 = userData.email;
        let userEmail2 = searchEmail;

        const docRef = doc(db, "users", searchEmail);
        let userExists = false;

        // check if the person we are sending the message to is registered or not
        async function checkUserExists() {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                userExists = true;
            }
        }
        await checkUserExists();



        let chatDocId = getChatDocId(userEmail1, userEmail2);
        const chatRef = doc(db, "chats", chatDocId);
        let chatExists = false;

        // check if the person we are sending the message to, we have already made contact or not
        async function checkChatExists() {
            const docSnap = await getDoc(chatRef);

            if (docSnap.exists()) {
                chatExists = true;
            }
        }
        await checkChatExists();

        if (userExists) {
            // open that chat window with that user
            if (chatExists) {
                let id = uuidv4();
                // 1) then send the message
                let chatData = { sender: userData.email, message: message, id: id, createdAt: getTimeStamp()};
                // for every new message sent mark it hasn't been read yet
                await updateDoc(chatRef, {
                    messages: arrayUnion(chatData),
                    recieverHasRead: false
                });

                // 2) redirect to that chat index
                let friendIndex = -1;
                friendChats.map((email, index) => {
                    if (email === searchEmail) {
                        friendIndex = index;
                    }
                })

                selectChat(friendIndex);
                setLoading(false);
            }

            // create a new chat with the user
            else {
                let id = uuidv4();
                let chatDocument = { messages: [{ sender: userEmail1, message: message, id: id, createdAt: getTimeStamp() }], userEmails: [userEmail1, userEmail2], recieverHasRead: false };
                await setDoc(chatRef, chatDocument);
                setLoading(false);
            }
        }

        // if the message to be sent isn't to a registered user
        else {
            setError(`${searchEmail} email is not registered`);

            setTimeout(() => {
                setError('');
                setLoading(false);
            }, 5000);
        }

        setSearchEmail('');
        setMessage('');
    })

    return (
        <div className='add-friend-cont'>

            {
                error !== '' ?
                    <Alert severity="error"> {error} </Alert> : null
            }

            <TextField
                id="outlined-search"
                label="Enter Email"
                type="search"
                size='medium'
                onChange={(e) => handleEmailType(e.target.value)}
                value={searchEmail} />

            <TextField
                id="outlined-search"
                label="Enter Message"
                type="Message"
                size='medium'
                onChange={(e) => setMessage(e.target.value)}
                value={message} />

            <Button
                variant="contained"
                disabled={loading}
                onClick={handleSubmitClick}> Submit </Button>
        </div>
    )
}