import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot, query, collection } from "firebase/firestore";
import { Avatar, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { db } from '../firebase';
import './Styles/GetChats.css';

export default function GetChats({ chatDataHome, userData, recieverEmail, getChatDocId }) {

    useEffect(() => {
        let chatsCont = document.querySelector('.old-chats-cont');
        chatsCont.scrollTo(0, chatsCont.scrollHeight);
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
                                        chatDataHome.map((chatObj) => (

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