import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import './popup.css';
import { useUser } from '../../UserContext';
import jsPDF from 'jspdf';
import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import { documentDir } from '@tauri-apps/api/path';

import { styled } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';
import { red } from '@mui/material/colors';

function PopupCertificado({ isOpen, onClose, onGenerate, initialData }) {
    const { user } = useUser();
    const now = dayjs().locale('es');
    const [errors, setErrors] = useState({});
    const [parroquias, setParroquias] = useState([]);

    const [formData, setFormData] = useState({
        bau_nombres: '',
        bau_apellidos: '',
        bau_cedula: '',
        bau_fecha_nac: now.format('YYYY-MM-DD'),
        bau_lugar_nac: '',
        bau_min_bau: 0,
        bau_padre: '',
        bau_madre: '',
        bau_padrinos: '',
        bau_min_cert: 0,
        bau_fecha_bau: now.format('YYYY-MM-DD'),
        bau_tomo: 0,
        bau_pag: 0,
        bau_num: 0,
        bau_tomo_nac: 0,
        bau_pag_nac: 0,
        bau_acta_nac: 0,
        bau_nota: '',
        bau_minbau_nombre: '',
        bau_mincert_nombre: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
            });
        } else {
            setFormData({
                bau_nombres: '',
                bau_apellidos: '',
                bau_cedula: '',
                bau_fecha_nac: now.format('YYYY-MM-DD'),
                bau_lugar_nac: '',
                bau_min_bau: 0,
                bau_padre: '',
                bau_madre: '',
                bau_padrinos: '',
                bau_min_cert: 0,
                bau_fecha_bau: now.format('YYYY-MM-DD'),
                bau_tomo: 0,
                bau_pag: 0,
                bau_num: 0,
                bau_tomo_nac: 0,
                bau_pag_nac: 0,
                bau_acta_nac: 0,
                bau_nota: '',
                bau_minbau_nombre: '',
                bau_mincert_nombre: '',
            });
        }
    }, [initialData, isOpen]);

    async function generatePDF() {
        const doc = new jsPDF();

        let currentParishPriest;
        try {
            const response = await invoke('get_all_ministros');
            currentParishPriest = response.find((ministro) => ministro.min_parroco_actual === 1);
            if (!currentParishPriest) {
                console.warn("No se encontró un párroco actual. Se usará el nombre por defecto.");
                currentParishPriest = { min_nombre: "MARCO GUALOTO" };
            }
        } catch (error) {
            console.error("Error al obtener el párroco actual:", error);
            currentParishPriest = { min_nombre: "MARCO GUALOTO" };
        }

        doc.addFont("/fonts/georgiab.ttf", "georgia", "bold");
        doc.addFont("/fonts/georgiaz.ttf", "georgia", "bolditalic");
        doc.addFont("/fonts/VerdanaNow.ttf", "verdana", "normal");
        doc.addFont("/fonts/verdana-bold.ttf", "verdana", "bold");

        doc.setFont("georgia", "bold");
        doc.setTextColor(35, 46, 114);
        doc.setFontSize(20);
        doc.text(`CERTIFICADO DE BAUTISMO`, 105, 20, null, null, 'center');

        const currentDate = new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        doc.setFontSize(12);
        doc.text(`QUITO, ${currentDate.toUpperCase()}`, 105, 30, null, null, 'center');

        doc.setFont("verdana", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Certifico que en el Tomo ${formData.bau_tomo} Página ${formData.bau_pag} No. ${formData.bau_num} de partidas Bautismales se encuentra`, 20, 40);
        doc.text(`inscrita una partida con los siguientes datos:`, 20, 45);

        let fechaBautizo = dayjs(formData.bau_fecha_bau).locale('es');
        let fechaBautizoFormatted = fechaBautizo.format('DD [del mes de] MMMM [del año del Señor] YYYY');
        doc.text(`El ${fechaBautizoFormatted}`, 20, 55);

        doc.text(`en (lugar) NUESTRA SEÑORA DE LA MERCED "LA ARCADIA"`, 20, 60);

        doc.text(`el (ministro) ${formData.bau_minbau_nombre} bautizó`, 20, 65);

        doc.text(`solemnemente a ${formData.bau_nombres} ${formData.bau_apellidos}`, 20, 70);

        let fechaNacimiento = dayjs(formData.bau_fecha_nac).locale('es');
        let fechaNacimientoFormatted = fechaNacimiento.format('DD [de] MMMM [del] YYYY');
        doc.text(`nacido/a en ${formData.bau_lugar_nac} el ${fechaNacimientoFormatted}`, 20, 75);

        doc.text(`hijo/a de ${formData.bau_padre}`, 20, 80);
        doc.text(`y de ${formData.bau_madre}`, 20, 85);

        doc.text(`feligreses de NUESTRA SEÑORA DE LA MERCED "LA ARCADIA"`, 20, 90);

        doc.text(`Fueron padrino (s)/ madrina (s)`, 20, 95);
        doc.text(`${formData.bau_padrinos}`, 20, 100);

        doc.text(`a quien (es) se advirtió sus obligaciones y parentesco espiritual.`, 20, 105);

        doc.text(`Lo certifica:`, 20, 110);
        doc.text(`${formData.bau_mincert_nombre}`, 20, 115);

        doc.setFont("verdana", "bold");
        doc.text(`Son datos fielmente tomados del original.`, 20, 125);
        doc.text(`Lo Certifico,`, 20, 130);

        doc.setFont("helvetica", "bold");
        doc.text(`______________________________`, 20, 150);
        doc.text(`P. ${currentParishPriest.min_nombre}`, 20, 155);
        doc.text(`PÁRROCO`, 20, 160);

        const pdfBytes = doc.output('arraybuffer');
        const fileName = `certificado_bautismo_${formData.bau_nombres}_${formData.bau_apellidos}_${now.format("YYYY-MM-DD_HH_mm_ss")}.pdf`;
        const dirPath = await documentDir();
        const filePath = `${dirPath}\\certificados\\${fileName}`;

        await writeBinaryFile({ path: filePath, contents: pdfBytes }, { dir: BaseDirectory.Document });
        await invoke("open_file", { filepath: filePath });
    }

    const handleSubmit = () => {
        generatePDF();
        onGenerate(formData);
    };



    if (!isOpen) return null;

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(blueGrey[900]),
        backgroundColor: blueGrey[900],
        '&:hover': {
            backgroundColor: blueGrey[500],
        },
    }));

    const ColorButtonRed = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[900],
        },
    }));

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className='gridCentrao grid-3row-center'>
                    <div className='gridCentrao info-per'>
                        <div><strong>Nombres: {formData.bau_nombres} {formData.bau_apellidos}</strong></div>
                        <br></br>
                    </div>
                    <div className='gridTop cartas grid-2colum-equal'>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <h2>Datos de Bautismo</h2>
                                <div>
                                    <p><strong>Fecha de Bautizo:</strong> {formData.bau_fecha_bau}</p>
                                    <div className='gridCentrao2 grid-3colum-equal'>
                                        <div><strong>Tomo:</strong></div>
                                        <div><strong>Página:</strong></div>
                                        <div><strong>Número:</strong></div>
                                        <div>{formData.bau_tomo}</div>
                                        <div>{formData.bau_pag}</div>
                                        <div>{formData.bau_num}</div>
                                    </div>
                                    <p><strong>Padre:</strong> {formData.bau_padre}</p>
                                    <p><strong>Madre:</strong> {formData.bau_madre}</p>
                                    <div id="padrinos" className='gridCentrao2'>
                                        <div><strong>Padrinos/Madrinas:</strong> {formData.bau_padrinos}</div>
                                    </div>
                                    <p><strong>Ministro de Bautizo:</strong> {formData.bau_minbau_nombre}</p>
                                    <p><strong>Ministro Certifica:</strong> {formData.bau_mincert_nombre}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <h2>Datos Registro Civil</h2>
                                <div>
                                    <p><strong>Fecha de Nacimiento:</strong> {formData.bau_fecha_nac}</p>
                                    <div className='gridCentrao2 grid-3colum-equal'>
                                        <div><strong>Tomo:</strong></div>
                                        <div><strong>Página:</strong></div>
                                        <div><strong>Número:</strong></div>
                                        <div>{formData.bau_tomo_nac}</div>
                                        <div>{formData.bau_pag_nac}</div>
                                        <div>{formData.bau_num_nac}</div>
                                    </div>
                                    <p><strong>Cédula:</strong> {formData.bau_cedula}</p>
                                    <p><strong>Lugar de nacimiento:</strong> {formData.bau_lugar_nac}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <br></br>
                    <div className="gridCentraoButtons grid-2colum-equal-lessSpace">
                        <ColorButton startIcon={<AssignmentIcon />} variant="contained" onClick={handleSubmit}>Generar</ColorButton>
                        <ColorButtonRed startIcon={<CloseIcon />} variant="contained" onClick={onClose}>Cancelar</ColorButtonRed>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupCertificado