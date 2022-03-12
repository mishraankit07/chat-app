import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function UserChatsNav({recieverEmail}) {

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp"> {recieverEmail.split('@')[0][0]} </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        style={{marginLeft:"0.5rem"}}
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        {recieverEmail.split('@')[0]}
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
} 