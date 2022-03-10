import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import './Styles/AddFriend.css';
import { doc, getDocs, getDoc,setDoc,updateDoc,collection, query, where } from "firebase/firestore";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { db } from '../firebase';
import './Styles/AddFriend.css';
import { v4 as uuidv4 } from 'uuid';

export default function AddFriend({ userData,getChatDocId }) {

    const [searchEmail, setSearchEmail] = useState('');
    const [message,setMessage]=useState('');
    // const [allUsers, setAllUsers] = useState([]);
    // const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        //console.log("search email:", searchEmail);

        const q = query(collection(db, "users"));

        let allUsersTemp = [];

        async function getSearchUsers() {
            /* const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                //console.log("hi");
                // doc.data() is never undefined for query doc snapshots
                allUsersTemp.push(doc.data().email);
            });

            setAllUsers([...allUsersTemp]);
            setFilteredUsers([...allUsersTemp]);
            console.log("all users:",allUsers); */
        }

        getSearchUsers();
    }, [])

    const handleEmailType = (val) => {
        setSearchEmail(val);

        /*console.log("all users:", allUsers);

        let filteredList = [];

        for (let i = 0; i < allUsers.length; i++) {
            // console.log("all users:", allUsers[i]);
            if (allUsers[i].includes(val)) {
                filteredList.push(allUsers[i]);
            }

            console.log("filtered users:", filteredList);
            setFilteredUsers(filteredList);
        }*/
    }

    const handleSubmitClick = (async() => {

        let userEmail1 = userData.email;
        let userEmail2 = searchEmail;

        let chatDocId=getChatDocId(userEmail1,userEmail2);
        const chatRef = doc(db, "chats", chatDocId);
        let id=uuidv4();

        let chatDocument = { messages: [{ sender: userEmail1, message: message }], id:id,userEmails: [userEmail1,userEmail2]};
        await setDoc(chatRef, chatDocument);

        setSearchEmail('');
        setMessage('');
    })

return (
        <div className='add-friend-cont'>
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
                onClick={handleSubmitClick}> Submit </Button>

            {
                /* <Box sx={{ width: '100%', maxWidth: 360, bgcolor: '#bdc3c7' }}>
                    <List className='suggestions-cont'>
                        {
                            filteredUsers.map((email) => {
                                return (
                                    <ListItem onClick={handleFriendEmailClick}> {email} </ListItem>
                                )
                            })
                        }
                    </List>
                </Box> */
            }
        </div>
    )
}