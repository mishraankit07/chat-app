import logo from './logo.svg';
import './App.css';
import Signup from './Components/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/Login';
import Home from './Components/Home';
import { AuthProvider } from './Context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={< Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
