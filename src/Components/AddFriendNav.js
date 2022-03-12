import React,{useState,useContext} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Typography } from '@mui/material';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddFriendNav({userData,handleLogout,handleAddFriend}) {
    
    const { logout } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleLogoutFn = async () => {
        handleClose();
        handleLogout();
    }

    const handleAddFriendFn=()=>{
        handleClose();
        handleAddFriend();
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className='name-banner'> {userData == null ? "Fetching Your Data, just a second!" : `Hi ${userData.name}`} </Typography>

                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleAddFriendFn}> Add Friend </MenuItem>
                            <MenuItem onClick={handleLogoutFn}> Logout </MenuItem>

                        </Menu>
                    </div>

                </Toolbar>
            </AppBar>
        </Box>
    )
} 