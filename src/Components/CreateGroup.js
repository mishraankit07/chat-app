import React, { useState, useContext } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../Context/AuthContext';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase';

import './Styles/CreateGroup.css';

export default function CreateGroup({ userData, checkDocExists }) {

    const [groupName, setGroupName] = useState('');
    const [emails, setEmails] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { getTimeStamp } = useContext(AuthContext);

    //console.log("check doc exists:",checkDocExists);

    const getGroupDocId = (email1, email2) => {

        let val = email1.localeCompare(email2);
        let groupDocId = email2 + '#@!' + email1;

        // uid1 is lexicographically smaller 
        if (val < 0) {
            groupDocId = email1 + '#@!' + email2;
        }

        // console.log("returning:", chatDocId);
        return groupDocId;

    }

    const handleSubmitClick = async () => {

        let emailsList = emails.trim().split(',');
        emailsList.push(userData.email);

        let groupDocId = emailsList[0];


        for (let i = 1; i < emailsList.length; i++) {
            groupDocId = getGroupDocId(groupDocId, emailsList[i]);
        }

        let id = uuidv4();

        // console.log("group data:",dataObj);
        // console.log("group id:",groupDocId);

        let docExists = false;//await checkDocExists('groups', groupDocId);
        let firstTimeChat = !docExists;

        const docRef = doc(db, "groups", groupDocId);

        // create a group
        if (firstTimeChat==true) {
            const groupDocument = {
                messages: [{ sender: userData.email, message: message, id: id, createdAt: getTimeStamp() }],
                userEmails: [...emailsList]
            }
            await setDoc(docRef, groupDocument);
        }

        // the group already exists so update the document only
        else {
            let id = uuidv4();
            let chatData = { sender: userData.email, message: message, id: id, createdAt: getTimeStamp() };
            await updateDoc(docRef, {
                messages: arrayUnion(chatData),
                recieverHasRead: false
            });
        }

    }

    return (
        <div className='create-group-form'>
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