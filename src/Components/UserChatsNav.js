import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';


// group name / user name
export default function UserChatsNav({ name }) {

    // console.log("group name from userchatsnav:", name);

    return (
        <AppBar position="static">
                <Toolbar style={{marginLeft:"1rem"}} disableGutters>
                    <IconButton sx={{ p: 0 }}>
                        <Avatar alt="Remy Sharp"> {name[0]} </Avatar>
                    </IconButton>

                <Typography style={{marginLeft:"0.5rem"}}> {name} </Typography>
                </Toolbar>
        </AppBar>
    )
} 