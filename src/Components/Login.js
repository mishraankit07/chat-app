import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './Styles/Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { AuthContext } from '../Context/AuthContext';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { user } = useContext(AuthContext);

    // if user is already signed in navigate to feed
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    },[])

    // console.log("user before login:",user);

    let handleLogin = () => {
        setLoading(true);
        setError('');

        login(email, password).then(() => {
            setLoading(false);
            setError('');

            // console.log("user successfully logged in!");
            navigate('/');
        })
            .catch((error) => {
                setError(error.code);

                setInterval(() => {
                    setError('');
                }, 5000)
            })

        setLoading(false);
    }

    return (
        <Box>
            <Card variant="outlined" className='login-cont'>
                <CardContent>
                    <div className='login-info'>
                        <TextField id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />

                        <TextField id="outlined-password-input"
                            label="Password"
                            type="password"
                            variant="outlined"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />

                        {
                            error != '' && <Alert severity='error'> Something Went Wrong! Please Try again </Alert>
                        }

                        <Button
                            variant="contained"
                            size="small"
                            disabled={loading}
                            onClick={handleLogin}> Login </Button>
                    </div>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;