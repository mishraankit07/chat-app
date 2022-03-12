import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot, query, collection } from "firebase/firestore";
import { Avatar, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { db } from '../firebase';
import './Styles/GetChats.css';
import UserChatsNav from './UserChatsNav';

export default function GetChats({ chatDataHome, userData, recieverEmail, getChatDocId }) {

    useEffect(() => {
        let chatsCont = document.querySelector('.old-chats-cont');
        chatsCont.scrollTo(0, chatsCont.scrollHeight);
    })


    return (
        <div style={{ height: "80vh" }}>
            {
                (!userData) ? <CircularProgress /> :
                    (recieverEmail == null || recieverEmail == undefined) ? <div className='old-chats-cont'></div> :
                        <div className='old-chats-section'>
                            <UserChatsNav recieverEmail={recieverEmail} />
                            {
                                <div className='old-chats-cont'>
                                    {
                                        chatDataHome.map((chatObj) => (
                                            <React.Fragment>
                                                {
                                                    (chatObj.sender == userData.email) ?
                                                        <div className='chat-cont' key={chatObj.id}>
                                                            <Typography className='chat sender-chat'> {chatObj.message} </Typography> </div> :
                                                        <div className='chat-cont' key={chatObj.id}>
                                                            <Typography className='chat reciever-chat'> {chatObj.message} </Typography>
                                                        </div>
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                            }
                        </div>
            }
        </div>
    );
}