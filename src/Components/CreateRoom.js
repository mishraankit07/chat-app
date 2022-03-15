import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import { checkDocExists } from './Utility/utilityFunctions';
import './Styles/CreateRoom.css';

export default function CreateRoom() {

    let [name, setName] = useState('');
    let [roomId, setRoomId] = useState('');
    let [loading, setLoading] = useState('');

    const navigate = useNavigate();

    const handleSubmitClick = async () => {
        setLoading(true);

        let docExists = await checkDocExists('rooms', roomId);


        // then don't create a new room document
        if (docExists == true) {
            const docRef = doc(db, "rooms", roomId);

            await updateDoc(docRef, {
                usersIn: arrayUnion(name)
            });
        }

        else {
            const docRef = doc(db, "rooms", roomId);

            const roomDocument = {
                roomId: roomId,
                messages: [],
                usersIn: [name]
            }

            await setDoc(docRef, roomDocument);
        }

        navigate(`/rooms/${roomId}/${name}`, { submitBtnClicked: "true" });

        setName('');
        setRoomId('');
        setLoading(false);
    }

    return (
        <div className='create-room-form-cont'>
            <div className='create-room-form'>
                <TextField
                    id="outlined-search"
                    label="Name"
                    type="search"
                    size='medium'
                    onChange={(e) => setName(e.target.value)}
                    value={name} />

                <TextField
                    id="outlined-search"
                    label="Room Id"
                    type="search"
                    size='medium'
                    onChange={(e) => setRoomId(e.target.value)}
                    value={roomId} />

                <Button
                    variant="contained"
                    disabled={loading}
                    onClick={handleSubmitClick}> Submit </Button>
            </div>
        </div>
    );
}