import React, { useState, useEffect, useContext } from 'react';
import List from '@mui/material/List';
import { AuthContext } from '../Context/AuthContext';
import './Styles/Home.css';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { Avatar, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import GetChats from './GetChats';
import NewChat from './NewChat';
import { collection, query, where, getDocs } from "firebase/firestore";
import AddFriend from './AddFriend'
import { v4 as uuidv4 } from 'uuid';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import { ListItem } from '@mui/material';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import AddFriendNav from './AddFriendNav';
import CreateGroup from './CreateGroup';
import GetGroupChats from './GetGroupChats';
import NewGroupChat from './NewGroupChat';

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

    const [createGroupClicked, setCreateGroupClicked] = useState(false);
    const [showGroupChats, setShowGroupChats] = useState(false);
    const [groupChats, setGroupChats] = useState(null);
    const [selectedGroupChat, setSelectedGroupChat] = useState(null);

    const handleCreateGroup = () => {
        setAddFriendClicked(false);
        setCreateGroupClicked(true);
    }

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

                // console.log("chats:", chatsArr);
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

    // fetch the groups with which current user is envolved with
    useEffect(() => {
        if (userData) {

            const groupsRef = collection(db, "groups");
            // Create a query against the collection.

            const unsub = onSnapshot(query(groupsRef, where("userEmails", "array-contains", userData.email)), (res) => {
                let chatsArr = [];

                res.docs.map((doc, index) => {
                    chatsArr.push(doc.data());
                })

                console.log("complete group chats:", chatsArr);
                // console.log("friends emails:",friendsEmails);

                setGroupChats(chatsArr);
            });

            return () => {
                console.log("removing snapshot listners in group chat from Home");
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

    const selectGroupChat = async (index) => {

        // console.log("called!");
        if (groupChats) {


            setSelectedGroupChat(index);
            setSelectedChat(null);
            setCreateGroupClicked(false);
            // console.log("selected group chat:", selectGroupChat);
            // console.log("selected group chat data from home:", groupChats[index]);
            // console.log("selected group chat name from home:", groupChats[index].groupName);

            // if the user himself has not sent the message
            if (groupChats[index].messages[groupChats[index].messages.length - 1].sender != userData.email) {
                let groupChatDocId = groupChats[index].groupName;

                let emailsList=groupChats[index].userEmails.sort();

                for(let i=0;i<emailsList.length;i++){
                    groupChatDocId=groupChatDocId + '#@!' + emailsList[i];
                }


                console.log("group chats doc id in home:",groupChatDocId);
                const chatRef = doc(db, "groups", groupChatDocId);

                // current user has read the latest message
                await updateDoc(chatRef, {
                    recieversRead: arrayUnion(userData.email)
                });
            }
        }

    }

    const selectChat = async (index) => {
        //console.log("selected chat:", index);
        setSelectedChat(index);
        setAddFriendClicked(false);
        setSelectedGroupChat(null);

        // if the last message was sent by the login user itself, then don't remove the notification 
        if (chats[index].messages[chats[index].messages.length - 1].sender != userData.email) {
            let chatDocId = getChatDocId(userData.email, friendChats[index]);
            const chatRef = doc(db, "chats", chatDocId);

            await updateDoc(chatRef, {
                recieverHasRead: true
            });
        }
    }

    const handleAddFriend = () => {
        setCreateGroupClicked(false);
        setAddFriendClicked(true);

        //console.log("handle add friend clicked");
    }

    const handleSwitchToggle = (e) => {
        setShowGroupChats(!showGroupChats);
        setSelectedGroupChat(null);
        setSelectedChat(null);
    }

    const getGroupChatDocId = (emails) => {

        // console.log("selected group from home.js:",selectedGroupChat);
        // console.log("group from home.js:",groupChats[selectedGroupChat]);
        //console.log("group name:", groupChats[selectedGroupChat].groupName);
        if (groupChats && selectedChat) {
            let groupChatDocId = groupChats[selectedChat].groupName;
            for (let i = 0; i < emails.length; i++) {
                groupChatDocId = getChatDocId(groupChatDocId, emails[i]);
            }

            return groupChatDocId;
        }
    }

    return (
        <div className='home-cont'>
            <div className="home-content">
                <Card className='users-cont-card' variant="outlined">
                    <AddFriendNav userData={userData} handleAddFriend={handleAddFriend} handleCreateGroup={handleCreateGroup} handleLogout={handleLogout} />
                    <FormGroup style={{ display: "flex", height: "5vh", alignItems: "center" }}>
                        <FormControlLabel control={<Switch onChange={handleSwitchToggle} />} label="Groups" />
                    </FormGroup>

                    <List className='users-cont'>
                        {
                            (showGroupChats) ?
                                (groupChats == null) ? <CircularProgress /> :
                                    groupChats.map((groupObj, index) => {
                                        return (
                                            <ListItem className='user'
                                                selected={selectedGroupChat == index}
                                                onClick={() => selectGroupChat(index)} key={uuidv4()}>
                                                <Avatar sx={{ height: "3rem", width: "3rem" }}> {groupObj.groupName[0]} </Avatar>
                                                <div className='user-info'>
                                                    <Typography className='user-email'> {groupObj.groupName} </Typography>
                                                    <Typography> {groupObj.messages[groupObj.messages.length - 1].sender + ':' + groupObj.messages[groupObj.messages.length - 1].message.substring(0, 10)} </Typography>
                                                </div>
                                                {(groupObj.messages[groupObj.messages.length - 1].sender != userData.email) && (groupObj.recieversRead.includes(userData.email)==false) ? <AddAlertIcon /> : null}
                                            </ListItem>
                                        )
                                    })
                                :


                                (friendChats == null || chats == null) ? <CircularProgress /> :
                                    chats.map((chatObj, index) => {
                                        return (

                                            <ListItem className='user'
                                                selected={selectedChat == index}
                                                onClick={() => selectChat(index)} key={uuidv4()}>
                                                <Avatar sx={{ height: "3rem", width: "3rem" }}> {chatObj.userEmails.filter((email) => { return (email != userData.email) })[0].split('@')[0][0]} </Avatar>
                                                <div className='user-info'>
                                                    <Typography className='user-email'> {friendChats[index]} </Typography>
                                                    <Typography> {chatObj.messages[chatObj.messages.length - 1].message.substring(0, 25)} </Typography>
                                                </div>
                                                {(chatObj.messages[chatObj.messages.length - 1].sender != userData.email) && (chatObj.recieverHasRead == false) ? <AddAlertIcon /> : null}
                                            </ListItem>
                                        )
                                    })
                        }
                    </List>
                </Card>

                <div className='chats-cont'>
                    <Card className='old-chats-card' variant="outlined">
                        {
                            createGroupClicked ?
                                <CreateGroup
                                    userData={userData}
                                    checkDocExists={checkDocExists}
                                    groupChats={groupChats}
                                    selectGroupChatFn={selectGroupChat} /> :
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
                                        /> :

                                        (selectedGroupChat != null && selectedGroupChat != undefined) ?
                                            <GetGroupChats
                                                userData={userData}
                                                groupChatData={groupChats[selectedGroupChat]}
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
                            /> :
                                (addFriendClicked == false && groupChats!=null && createGroupClicked == false && selectedGroupChat != null) ?
                                    <NewGroupChat
                                        userData={userData}
                                        groupChatData={groupChats[selectedGroupChat]} 
                                        getGroupChatDocId={getGroupChatDocId}/> : null
                        }
                    </Card>
                </div>
            </div>
        </div>
    )
}