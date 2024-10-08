import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/estilosNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from '../UserContext';
import {
  faSignOutAlt,
  faChurch,
  faFireFlameCurved,
  faUsers,
  faUser,
  faCity,
  faBuilding,
  faUserTie,
  faCross,
} from '@fortawesome/free-solid-svg-icons';

const data = [
  { link: '/perfil', label: 'Perfil', icon: faUser, permisos: 1 },
  { link: '/home', label: 'Inicio', icon: faChurch, permisos: 1 },
  { link: '/bautizados', label: 'Bautizados', icon: faCross, permisos: 1 },
  { link: '/ministros', label: 'Ministros', icon: faUserTie, permisos: 2 },
  { link: '/usuarios', label: 'Usuarios', icon: faUsers, permisos: 2 }
];

const permisosData = [
  { nivel: 1, nombre: "Usuario" },
  { nivel: 2, nombre: "Admin" },
  { nivel: 3, nombre: "SuperAdmin" }
];

const Navbar = ({ onLogout }) => {
  const { user } = useUser();
  const [active, setActive] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = data.find(item => item.link === currentPath);
    if (currentItem) {
      setActive(currentItem.label);
    }
  }, [location]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const usuarioNivel = permisosData.find(permiso => permiso.nombre === user.usu_rol)?.nivel;
  const links = data
    .filter(item => item.permisos <= usuarioNivel)
    .map((item) => (
      <Link
        className={`link ${item.label === active ? 'active' : ''}`}
        to={item.link}
        key={item.label}
        onClick={() => setActive(item.label)}
      >
        <FontAwesomeIcon icon={item.icon} className="linkIcon" />
        <span>{item.label}</span>
      </Link>
    ));

  return (
    <nav className="navbar light">
      <div className="navbarMain">
        <div className="header">
          <div className='aa gridCentrao3' >
            <img src="/images/logo_4x.png" alt="Logo Vicaria" width="120vw" height="120vh"></img>
          </div>
        </div>
        {links}
      </div>
      <div className="footer">
        <a href="#" className="link" onClick={(event) => onLogout()}>
          <FontAwesomeIcon icon={faSignOutAlt} className="linkIcon" />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
