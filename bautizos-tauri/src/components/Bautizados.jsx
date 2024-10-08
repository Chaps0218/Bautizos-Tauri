import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import PopupBautizado from './popups/PopupBautizado';
import PopupCertificado from './popups/PopupCertificado';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { amber } from '@mui/material/colors';
import '../App.css';

function Bautizos() {
  const [bautizados, setBautizados] = useState([]);
  const [filteredbautizados, setFilteredbautizados] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [isPopupOpenCert, setIsPopupOpenCert] = useState(false);
  const [popupDataCert, setPopupDataCert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenPopup = (data = null) => {
    setPopupData(data);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupData(null);
  };

  const handleOpenPopupCert = (data = null) => {
    setPopupDataCert(data);
    setIsPopupOpenCert(true);
  };

  const handleClosePopupCert = () => {
    setIsPopupOpenCert(false);
    setPopupDataCert(null);
  };

  const handleSavePopup = async (data) => {
    try {
      if (data.bau_id) {
        await invoke('handle_modify_bautizado', { input: data });
      } else {
        await invoke('handle_add_bautizado', { input: data });
      }
      const updatedbautizados = await invoke('get_all_bautizados');
      setBautizados(updatedbautizados);
      setFilteredbautizados(updatedbautizados);
    } catch (error) {
      console.error(error);
    }
    handleClosePopup();
  };

  const handleSavePopupCert = async (data) => {
    try {
      if (data.bau_id) {
        await invoke('handle_modify_bautizado', { input: data });
      }
      const updatedbautizados = await invoke('get_all_bautizados');
      setBautizados(updatedbautizados);
      setFilteredbautizados(updatedbautizados);
    } catch (error) {
      console.error(error);
    }
    handleClosePopupCert();
  };


  const fetchbautizados = async () => {
    try {
      const bautizados = await invoke('get_all_bautizados');
      setBautizados(bautizados);
      setFilteredbautizados(bautizados);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredbautizados(bautizados);
    } else {
      const filtered = bautizados.filter((bautizado) =>
        bautizado.bau_nombres.toLowerCase().includes(query) ||
        bautizado.bau_apellidos.toLowerCase().includes(query) ||
        (bautizado.bau_fecha_bau && bautizado.bau_fecha_bau.toLowerCase().includes(query))
      );
      setFilteredbautizados(filtered);
    }
  };

  const ColorButtonAmber = styled(Fab)(({ theme }) => ({
    color: theme.palette.getContrastText(amber[900]),
    backgroundColor: amber[600],
    '&:hover': {
      backgroundColor: amber[900],
    },
  }));

  const AccordionDetailsEstilo = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0 , 1)',
    backgroundColor: 'rgba(0,0,0, 0.05)',
  }));

  const IconButtonBigger = styled(IconButton)(({ theme }) => ({
    '& svg': {
      fontSize: '2.7vmax',
    },
  }));

  useEffect(() => {
    fetchbautizados();
  }, []);

  return (
    <div className='gridTop main-bau'>
      <div>
        <h2>Bautizados</h2>
        <TextField
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: '10px' }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            style: {
              padding: '3px 10px',
              fontSize: '14px',
            },
          }}
          placeholder='Buscar'

        />
        <div className='gridCentrao3 grid-header-bau'>
          <p>Nombres Apellidos </p>
          <p>Fecha</p>
          <p>Más</p>
        </div>
        <div className='overflow'>
          {filteredbautizados.map((bautizado) => (
            <div className='marginAccordion' key={bautizado.bau_id}>
              <Accordion slotProps={{ transition: { unmountOnExit: true } }} className='modifiedAccordion'>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <div className='gridCentrao grid-2colum-noequal2'>
                    <div>
                      {bautizado.bau_nombres} {bautizado.bau_apellidos}
                    </div>
                    <div>
                      {bautizado.bau_fecha_bau}
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetailsEstilo>
                  <div className='gridCentrao2 grid2-colum '>
                    <div className='gridCentrao'>
                      <div className='gridCentrao2 grid-2colum-noequal-2'>
                        <strong>Cédula: </strong>
                        <div>
                          {bautizado.bau_cedula}
                        </div>
                        <strong>Padre: </strong>
                        <div>
                          {bautizado.bau_padre}
                        </div>
                        <strong >Madre: </strong>
                        <div >
                          {bautizado.bau_madre}
                        </div>
                        <strong >Padrino/Madrina: </strong>
                        <div >
                          {bautizado.bau_padrinos}
                        </div>
                        <strong >Ministro de Bautizo:</strong>
                        <div >
                          {bautizado.bau_minbau_nombre}
                        </div>
                        <strong >Ministro Párroco:</strong>
                        <div >
                          {bautizado.bau_mincert_nombre}
                        </div>
                      </div>
                      <div className='gridCentraoNoFull'>
                        <strong className='margin-bottom'>Información Bautizo:</strong>
                        <div className='gridCentrao2 info-libro'>
                          <div className='input-separado-2'><strong>Tomo:</strong> {bautizado.bau_tomo}</div>
                          <div className='input-separado-2'><strong>Página:</strong> {bautizado.bau_pag}</div>
                          <div className='input-separado-2'><strong>Número:</strong> {bautizado.bau_num}</div>
                        </div>
                      </div>
                    </div>

                    <div className='acciones'>
                      <Tooltip title="Editar">
                        <IconButtonBigger
                          aria-label="edit"
                          color='success'
                          onClick={() => handleOpenPopup(bautizado)}
                        >
                          <EditIcon />
                        </IconButtonBigger>
                      </Tooltip>
                      <Tooltip title="Generar Reporte">
                        <IconButtonBigger
                          aria-label="Report"
                          color="info"
                          onClick={() => handleOpenPopupCert(bautizado)}
                        >
                          <AssignmentIcon />
                        </IconButtonBigger>
                      </Tooltip>
                    </div>
                  </div>
                </AccordionDetailsEstilo>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
      <div className='fab-container'>
        <Tooltip title="Agregar Bautizado">
          <ColorButtonAmber color="error" aria-label="add" onClick={() => handleOpenPopup()}>
            <AddIcon />
          </ColorButtonAmber >
        </Tooltip>
      </div>
      <PopupBautizado
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSave={handleSavePopup}
        initialData={popupData}
      />

      <PopupCertificado
        isOpen={isPopupOpenCert}
        onClose={handleClosePopupCert}
        onGenerate={handleSavePopupCert}
        initialData={popupDataCert}
      />
    </div>
  );
}

export default Bautizos;
