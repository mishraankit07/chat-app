import React, { useState, useContext } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../Context/AuthContext';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';
import { Alert } from '@mui/material';
import './Styles/CreateGroup.css';

export default function CreateGroup({ userData, checkDocExists, groupChats, selectGroupChatFn }) {

    const [groupName, setGroupName] = useState('');
    const [emails, setEmails] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { getTimeStamp } = useContext(AuthContext);

    const handleSubmitClick = async () => {

        setLoading(true);
        let emailsList = emails.trim().split(',');
        emailsList.push(userData.email);

        // 1) check if all users are registered or not

        /*async function checkAllEmails() {
            let firstUnregisteredEmail = '';
            emailsList.forEach(async (email) => {
                let emailExists = await checkDocExists('users', email.trim());
                console.log(`${email}: exists or not ?`, emailExists);
                if (emailExists == false) {
                    firstUnregisteredEmail = email;
                }
            })
            console.log("first unregisterd mail inside:",firstUnregisteredEmail);
            return firstUnregisteredEmail;
        }

        let firstUnregisteredEmail=await checkAllEmails();
        console.log("first unregistered email:", firstUnregisteredEmail);*/

        emailsList.sort();
        let groupDocId = groupName;

        for (let i = 0; i < emailsList.length; i++) {
            groupDocId = groupDocId + '#@!' + emailsList[i];
        }

        let id = uuidv4();

        // console.log("group data:",dataObj);
        // console.log("group id:",groupDocId);

        let docExists = await checkDocExists('groups', groupDocId);
        let firstTimeChat = !docExists;

        const docRef = doc(db, "groups", groupDocId);

        // create a group
        if (firstTimeChat == true) {
            const groupDocument = {
                groupName: groupName,
                messages: [{ sender: userData.email, message: message, id: id, createdAt: getTimeStamp() }],
                userEmails: [...emailsList],
                recieversRead: []
            }
            await setDoc(docRef, groupDocument);
            setLoading(false);
        }

        // the group already exists so update the document only
        else {
            let id = uuidv4();
            let chatData = { sender: userData.email, message: message, id: id, createdAt: getTimeStamp() };
            await updateDoc(docRef, {
                messages: arrayUnion(chatData),
                recieverHasRead: false
            });


            setLoading(false);

            // show that group as active for now
            for (let i = 0; i < groupChats.length; i++) {
                if (groupChats[i].groupName == groupName) {
                    selectGroupChatFn(i);
                }
            }
        }

        setGroupName('');
        setEmails('');
        setMessage('');
    }

    return (
        <div className='create-group-form'>

            {
                error != '' ? <Alert severity="error"> {error} </Alert> : null
            }

            <TextField
                id="outlined-search"
                label="Enter Group Name"
                type="search"
                size='medium'
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName} />

            <TextField
                id="outlined-search"
                label="Enter Emails"
                type="search"
                size='medium'
                onChange={(e) => setEmails(e.target.value)}
                value={emails} />


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
                onClick={handleSubmitClick}> Submit </Button> </div>
    )
}