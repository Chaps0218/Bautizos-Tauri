import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import Ministro from './components/Ministro';
import Usuarios from './components/Usuarios';
import Perfil from './components/Perfil';
import './App.css';

function App() {
  const { loggedIn, handleLogin, handleLogout } = useUser();

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (loggedIn) {
      rootElement.classList.remove('background');
    } else {
      rootElement.classList.add('background');
    }
  }, [loggedIn]);

  return (
    <Router>
      <div className="app-container">
        {loggedIn && <Navbar onLogout={handleLogout} />}
        <div className="main-content">
          <Routes>
            <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
            <Route path="/home" element={loggedIn ? <Inicio /> : <Navigate to="/" />} />
            <Route path="/ministros" element={loggedIn ? <Ministro /> : <Navigate to="/" />} />
            <Route path="/usuarios" element={loggedIn ? <Usuarios /> : <Navigate to="/" />} />
            <Route path="/perfil" element={loggedIn ? <Perfil /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default function RootApp() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
