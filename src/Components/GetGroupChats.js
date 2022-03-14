import React from 'react';
import { CircularProgress } from '@mui/material';
import UserChatsNav from './UserChatsNav';
import { Typography } from '@mui/material';
import './Styles/GetGroupChats.css';

export default function GetGroupChats({ userData, groupChatData, getChatDocId }) {

    // console.log("group chat data from GetGroupChats:", groupChatData);

    return (
        <div style={{ height: "80vh" }}>
            {
                (!userData) ? <CircularProgress /> :
                    (!groupChatData) ? <div className='old-chats-cont'></div> :
                        <div className='old-chats-section'>
                            <UserChatsNav name={groupChatData.groupName} />
                            {
                                <div className='old-chats-cont'>
                                    {
                                        groupChatData.messages.map((chatObj) => (
                                            <React.Fragment>
                                                {
                                                    (chatObj.sender == userData.email) ?
                                                        <div className='chat sender-chat' key={chatObj.id}>
                                                            <Typography> {chatObj.message} </Typography> </div> :
                                                        <div className='chat reciever-chat' key={chatObj.id} style={{ display: "flex", flexDirection: "column" }} key={chatObj.id}>
                                                            <div>
                                                                <Typography style={{width:"20vw"}}> {chatObj.sender} </Typography>
                                                                <Typography className='chat'>  {chatObj.message} </Typography>
                                                            </div>
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
    )
} 