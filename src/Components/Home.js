import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { AuthContext } from '../Context/AuthContext';
import './Styles/Home.css';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { Avatar, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import GetChats from './GetChats';
import NewChat from './NewChat';
import { collection, query, where, getDocs } from "firebase/firestore";
import AddFriend from './AddFriend'
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import AddAlertIcon from '@mui/icons-material/AddAlert';

const ariaLabel = { 'aria-label': 'description' };


export default function Home() {

    const { user } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [friendChats, setFriendChats] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState(null);
    const [addFriendClicked, setAddFriendClicked] = useState(false);
    let [chatData, setChatData] = useState([]);

    // taking the doc id between two people as smaller lexicographic value + '#@!' + larger lexicographic value
    const getChatDocId = (uid1, uid2) => {

        // console.log("uid 1:", uid1);
        // console.log("uid 2:", uid2);

        if (!uid1 || !uid2) {
            return '';
        }

        let val = uid1.localeCompare(uid2);
        let chatDocId = uid2 + '#@!' + uid1;

        // uid1 is lexicographically smaller 
        if (val < 0) {
            chatDocId = uid1 + '#@!' + uid2;
        }

        // console.log("returning:", chatDocId);
        return chatDocId;
    }


    // get user data
    useEffect(() => {

        if (user) {
            // console.log("user email:", user.email);
            async function getData() {
                const docRef = doc(db, "users", user.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // console.log("Document data:", docSnap.data());
                    setUserData(docSnap.data());
                    // console.log("user data:", docSnap.data());
                }
            }

            getData();
        }
    }, [user])


    // fetch the chats with which current user is envolved with
    useEffect(() => {
        if (userData) {

            const chatsRef = collection(db, "chats");
            // Create a query against the collection.

            const unsub = onSnapshot(query(chatsRef, where("userEmails", "array-contains", userData.email)), (res) => {
                let chatsArr = [];

                res.docs.map((doc, index) => {
                    chatsArr.push(doc.data());
                })

                let friendsEmails = [];

                chatsArr.forEach((chatObj) => {
                    chatObj.userEmails.forEach((email) => {
                        if (email != userData.email) {
                            friendsEmails.push(email)
                        }
                    })
                })
                // console.log("friends emails:",friendsEmails);


                setFriendChats([...friendsEmails]);
                setChats([...chatsArr]);
            });

            return () => {
                console.log("removing snapshot listners from Home");
                unsub();
            }
        }
    }, [userData])

    const handleLogout = async () => {
        // console.log("logout called!");
        await logout();
        navigate('/login');
    }

    useEffect(() => {
        if (user == null) {
            navigate('/login');
        }
    }, [])


    // checks if a document 
    async function checkDocExists(collectionName, docId) {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        let exists = false;

        if (docSnap.exists()) {
            exists = true;
        }

        return exists;
    }

    const selectChat = (index) => {
        console.log("selected chat:", index);
        setSelectedChat(index);
        setAddFriendClicked(false);

        let users = document.querySelectorAll('.user');
        for (let i = 0; i < users.length; i++) {
            if (i == index) {
                users[i].classList.add('user-selected');
            }

            else {
                users[i].classList.remove('user-selected');
            }
        }
    }

    const handleAddFriend = () => {
        setAddFriendClicked(true);
        //console.log("handle add friend clicked");
    }

    return (
        <div className='home-cont'>
            <Typography className="user-name-cont" variant='h5'> {userData == null ? "Fetching Your Data, just a second!" : `Hi ${userData.name}`} </Typography>

            <div className="home-content">
                <Card className='users-cont-card' variant="outlined">
                    <div className='add-friend-banner' onClick={handleAddFriend}> ADD FRIEND </div>
                    <div className='users-cont'>
                        {
                            friendChats == null || chats == null ? <CircularProgress /> :
                                chats.map((chatObj, index) => {
                                    return (
                                        
                                        <div className='user'
                                            onClick={() => selectChat(index)} key={uuidv4()}>
                                            <Avatar sx={{ height: "3rem", width: "3rem" }}></Avatar>
                                            <div className='user-info'>
                                                <Typography className='user-email'> {friendChats[index]} </Typography>
                                                <Typography> {chatObj.messages[chatObj.messages.length - 1].message.substring(0, 30)} </Typography>
                                            </div>
                                            <AddAlertIcon style={{display:`${1}`}}/>
                                        </div>
                                    )
                                })
                        }
                    </div>
                    <Button variant='contained'
                        className='logout-btn'
                        size='medium'
                        onClick={handleLogout}> Logout </Button>
                </Card>
                <div className='chats-cont'>
                    <Card className='old-chats-card' variant="outlined">
                        {
                            addFriendClicked ?
                                <AddFriend userData={userData}
                                    getChatDocId={getChatDocId}
                                    friendChats={friendChats}
                                    selectChat={selectChat} /> :

                                (friendChats != null && selectedChat != -1 && selectedChat != undefined) ?
                                    <GetChats chatDataHome={chats[selectedChat].messages}
                                        userData={userData}
                                        recieverEmail={friendChats[selectedChat]}
                                        getChatDocId={getChatDocId}
                                    /> : null
                        }
                    </Card>

                    <Card className='new-chat-card' variant='outlined'>
                        {

                            (addFriendClicked == false && selectedChat != null) ? <NewChat userData={userData}
                                recieverEmail={!friendChats || selectedChat == null ? null : friendChats[selectedChat]}
                                getChatDocId={getChatDocId}
                                checkDocExists={checkDocExists}
                            /> : null
                        }
                    </Card>
                </div>
            </div>
        </div>
    )
}