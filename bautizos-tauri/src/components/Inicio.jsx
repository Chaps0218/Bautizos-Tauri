import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { useUser } from '../UserContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';

const Inicio = () => {
  const { user } = useUser();

  return (
    <div className='gridCentrao '>
      <div className='header-inicio'>
        
        <h1 id='vicaria_inicio'>Nuestra Señora de la Merced - Parroquia Arcadia</h1>

        <div className='gridCentrao3 grid-2colum-equal'>
          <div className='nombre'>
          <h1 id='nombre_inicio' >Bienvenido, {user.usu_nombre}</h1>
          </div>

          <div className='gridCentrao-top grid-2row-equal'>
            <div>
              <div className='ownCard longCard inicioCard'>
                <div className='gridCentrao3'>
                  <strong>Información cuenta</strong>
                </div>
                <div className='card-interno'>
                  <p>{user.usu_nombre}  {user.usu_apellido}</p>
                  {user.usu_rol === "Admin" ? <p>{"Administrador"}</p> :
                    <p>{user.usu_rol}</p>}
                  <p>{user.usu_username}</p>
                </div>
              </div>
            </div>
            <Link to="/bautizados" style={{ textDecoration: 'none' }}>
              <div className='ownCard longCard inicioCard'>
                <div className='imgCard'>
                  <img src="/images/bautizado.png" alt="bautizados"></img>
                </div>
                <strong>Emitir certificado</strong>
              </div>
            </Link>

          </div>

        </div>
      </div>




    </div>
  );
};

export default Inicio;
