import React, { useState, useEffect,useContext } from 'react';
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



export default function Home() {

    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const {user}=useContext(AuthContext);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    console.log("user:",user);

    return (
        <div className='home-cont'>
            <div className='users-cont'>
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItemButton
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0)}
                        >
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Inbox" />
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 1)}
                        >
                            <ListItemIcon>
                                <DraftsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Drafts" />
                        </ListItemButton>
                    </List>
                    <Divider />
                    <List component="nav" aria-label="secondary mailbox folder">
                        <ListItemButton
                            selected={selectedIndex === 2}
                            onClick={(event) => handleListItemClick(event, 2)}
                        >
                            <ListItemText primary="Trash" />
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 3}
                            onClick={(event) => handleListItemClick(event, 3)}
                        >
                            <ListItemText primary="Spam" />
                        </ListItemButton>
                    </List>
                </Box>
            </div>
            <div className='chats-cont'>
                <div className='other-user'> Hi </div>
                <div className="chats"></div>
            </div>
        </div>

    )
}