import logo from './logo.svg';
import './App.css';
import Signup from './Components/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/Login';
import Home from './Components/Home';
import Room from './Components/Room';
import CreateRoom from './Components/CreateRoom';
import { AuthProvider } from './Context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={< Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<CreateRoom />}/>
          <Route path="/rooms/:id/:name" element={<Room />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
