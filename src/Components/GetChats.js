import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot, query, collection } from "firebase/firestore";
import { Avatar, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { db } from '../firebase';
import './Styles/GetChats.css';
import { v4 as uuidv4 } from 'uuid';
import { List, ListItem } from '@mui/material';

export default function GetChats({ userData, recieverEmail, getChatDocId }) {

    let [chatData, setChatData] = useState([]);
    let [docExists, setDocExists] = useState(null);

    useEffect(() => {

        if (userData != null && recieverEmail != null && recieverEmail != undefined) {

            async function getData() {

                // console.log("user email:",userData.email);
                let chatDocId = getChatDocId(userData.email, recieverEmail);

                // console.log("chat doc id:",chatDocId);

                /*if (docExists == null) {
                    const docRef = doc(db, "chats", chatDocId);
                    const docSnap = await getDoc(docRef);

                    setDocExists(docSnap.exists());
                } */
            }

            //getData();


            //if (docExists == true) {
            console.log("getting chats for:", userData.email, "from:", recieverEmail);

            let chatDocId = getChatDocId(userData.email, recieverEmail);

            const unsub = onSnapshot(doc(db, "chats", chatDocId), (doc) => {
                console.log("chats data: ", doc.data().messages);
                setChatData([...doc.data().messages]);
            });

            // remove the listner 
            /*return () => {
                unsub();
            }*/
            //}
        }
    },[userData,recieverEmail])

    // dummy one to see variable values 
    useEffect(() => {
        //console.log("reciever email:", recieverEmail);
        //console.log("chats:",chatData);
    })

    return (
        <div style={{ height: "72vh" }}>
            {
                (!userData) ? <CircularProgress /> :
                    (recieverEmail == null || recieverEmail == undefined) ? <div className='old-chats-cont'></div> :
                        <div className='old-chats-section'>
                            <div className='reciever-banner'>
                                <Avatar> {recieverEmail.split('@')[0][0]} </Avatar>
                                <Typography> {recieverEmail.split('@')[0]} </Typography>
                            </div>
                            {
                                <div className='old-chats-cont'>
                                    {
                                        chatData.map((chatObj) => (

                                            <div className='chat-cont' key={chatObj.id}>
                                                {
                                                    (chatObj.sender == userData.email) ?
                                                        <Typography className='chat sender-chat'> {chatObj.message} </Typography> :
                                                        <Typography className='chat reciever-chat'> {chatObj.message} </Typography>
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
            }
        </div>
    );
}