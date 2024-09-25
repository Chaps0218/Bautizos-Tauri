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
import { teal } from '@mui/material/colors';
import { red } from '@mui/material/colors';

function PopupCertificado({ isOpen, onClose, onGenerate, initialData }) {
    const now = dayjs().locale('es');

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
        bau_fecha_acta: '',
        bau_anio_acta: 0,
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
                bau_fecha_acta: '',
                bau_anio_acta: 0,
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
        let lineHeight = 7; // Altura de cada línea
        let marginLeft = 20; // Margen izquierdo
        let marginTop = 55; // Margen superior
        let currentY = marginTop; // Posición vertical inicial

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

        doc.addFont("/fonts/georgiab.ttf", "Georgia-Bold", "bold");
        doc.addFont("/fonts/georgiaz.ttf", "Georgia-BoldItalic", "bolditalic");
        doc.addFont("/fonts/georgia.ttf", "Georgia", "normal");
        doc.addFont("/fonts/VerdanaNow.ttf", "Verdana", "normal");
        doc.addFont("/fonts/verdana-bold.ttf", "Verdana-Bold", "bold");

        // Encabezado
        doc.setFont("Georgia-Bold", "bold");
        doc.setTextColor(35, 46, 114);
        doc.setFontSize(20);
        doc.text("CERTIFICADO DE BAUTISMO", 105, currentY, { align: "center" });

        // Información general
        const currentDate = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
        currentY += lineHeight + 1;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(`QUITO, ${currentDate}`, 190, currentY, { align: 'right' });

        // Posición inicial para la información del certificado
        currentY += lineHeight + 5; // Espacio extra entre el título y el contenido

        doc.setFont("Georgia", "normal");


        let maxWidth = doc.internal.pageSize.getWidth() - 15;
        let maxWidthColumna = doc.internal.pageSize.getWidth() - 140;

        const lines = [
            { text: "Certifico que en el Tomo ", style: "normal", endline: false },
            { text: `${formData.bau_tomo}`, style: "bold", endline: false },
            { text: " Página ", style: "normal", endline: false },
            { text: `${formData.bau_pag}`, style: "bold", endline: false },
            { text: " No. ", style: "normal", endline: false },
            { text: `${formData.bau_num}`, style: "bold", endline: false },
            { text: " de partidas Bautismales se encuentra inscrita una partida con los siguientes datos:", style: "normal", endline: false },
        ];

        lines.forEach(line => {
            const fontType = line.style === "bold" ? "Georgia-Bold" : "Georgia";
            const fontStyle = line.style === "bold" ? "bold" : "normal";
            doc.setFont(fontType, fontStyle);

            let text = line.text;
            let textWidth = doc.getTextWidth(text);

            if (marginLeft + textWidth > maxWidth) {
                const splitText = doc.splitTextToSize(text, maxWidth - marginLeft);
                splitText.forEach((txtLine, index) => {
                    if (index === 0) {
                        doc.text(txtLine, marginLeft, currentY);
                        marginLeft = 20;
                        currentY += lineHeight;
                    } else {
                        doc.text(txtLine, marginLeft, currentY);
                        marginLeft += doc.getTextWidth(txtLine) + 1;
                    }
                });
            } else {
                doc.text(text, marginLeft, currentY);
                marginLeft += textWidth;
            }
            if (line.endline) {
                marginLeft = 20;
                currentY += lineHeight;
            }
        });

        const datos = [
            { text: "Datos:", style: "bold", endline: true },
            { text: `${formData.bau_nombres}`, style: "normal", endline: true },
            { text: `${formData.bau_apellidos}`, style: "normal", endline: true },
        ]

        currentY += lineHeight + 5;
        let currentY2 = currentY;
        marginLeft = 20;

        datos.forEach(line => {
            const fontType = line.style === "bold" ? "Georgia-Bold" : "Georgia";
            const fontStyle = line.style === "bold" ? "bold" : "normal";
            doc.setFont(fontType, fontStyle);

            let text = line.text;
            let textWidth = doc.getTextWidth(text);

            if (marginLeft + textWidth > maxWidthColumna) {
                const splitText = doc.splitTextToSize(text, maxWidthColumna - marginLeft);
                splitText.forEach((txtLine, index) => {

                    doc.text(txtLine, marginLeft, currentY);
                    marginLeft = 20;
                    currentY += lineHeight;

                });
            } else {
                doc.text(text, marginLeft, currentY);
                marginLeft += textWidth;
            }
            if (line.endline) {
                marginLeft = 20;
                currentY += lineHeight;
            }
        });

        const notaMarginal = [
            { text: "Nota Marginal", style: "bold", endline: true },
            { text: `${formData.bau_nota}`, style: "normal", endline: true },
        ]

        currentY += lineHeight + 10;

        notaMarginal.forEach(line => {
            const fontType = line.style === "bold" ? "Georgia-Bold" : "Georgia";
            const fontStyle = line.style === "bold" ? "bold" : "normal";
            doc.setFont(fontType, fontStyle);

            let text = line.text;
            let textWidth = doc.getTextWidth(text);

            if (marginLeft + textWidth > maxWidthColumna) {
                const splitText = doc.splitTextToSize(text, maxWidthColumna - marginLeft);
                splitText.forEach((txtLine, index) => {

                    doc.text(txtLine, marginLeft, currentY);
                    marginLeft = 20;
                    currentY += lineHeight;

                });
            } else {
                doc.text(text, marginLeft, currentY);
                marginLeft += textWidth;
            }
            if (line.endline) {
                marginLeft = 20;
                currentY += lineHeight;
            }
        });

        const rCivil = [
            { text: "R. Civil.", style: "bold", endline: true },
            { text: `Código: ${formData.bau_cedula}`, style: "normal", endline: true },
            { text: ` `, style: "normal", endline: true },
            { text: `Año: ${formData.bau_anio_acta}`, style: "normal", endline: true },
            { text: `Tomo: ${formData.bau_tomo_nac}`, style: "normal", endline: true },
            { text: `Pág: ${formData.bau_pag_nac}`, style: "normal", endline: true },
            { text: `Acta: ${formData.bau_acta_nac}`, style: "normal", endline: true },
            { text: `Lugar: ${formData.bau_lugar_nac}`, style: "normal", endline: true },
        ]

        currentY += lineHeight + 10;

        rCivil.forEach(line => {
            const fontType = line.style === "bold" ? "Georgia-Bold" : "Georgia";
            const fontStyle = line.style === "bold" ? "bold" : "normal";
            doc.setFont(fontType, fontStyle);

            let text = line.text;
            let textWidth = doc.getTextWidth(text);

            if (marginLeft + textWidth > maxWidthColumna) {
                const splitText = doc.splitTextToSize(text, maxWidthColumna - marginLeft);
                splitText.forEach((txtLine, index) => {

                    doc.text(txtLine, marginLeft, currentY);
                    marginLeft = 20;
                    currentY += lineHeight;

                });
            } else {
                doc.text(text, marginLeft, currentY);
                marginLeft += textWidth;
            }
            if (line.endline) {
                marginLeft = 20;
                currentY += lineHeight;
            }
        });

        let fecha_bau_js = dayjs(formData.bau_fecha_bau, 'YYYY-MM-DD').locale('es');
        let fecha_nac_js = dayjs(formData.bau_fecha_nac, 'YYYY-MM-DD').locale('es');

        const parrafo = [
            { text: `El ${fecha_bau_js.format('DD [del mes de] MMMM [del año del Señor] YYYY')} `, style: "normal", endline: true },
            { text: `en NUESTRA SEÑORA DE LA MERCED "LA ARCADIA" `, style: "normal", endline: true },
            { text: `el ${formData.bau_minbau_nombre} bautizó`, style: "normal", endline: true },
            { text: `solemnemente a ${formData.bau_nombres} ${formData.bau_apellidos}`, style: "normal", endline: true },
            { text: `nacido/a en ${formData.bau_lugar_nac} el ${fecha_nac_js.format('DD [de] MMMM [del] YYYY')}`, style: "normal", endline: true },
            { text: `hijo/a de ${formData.bau_padre}`, style: "normal", endline: true },
            { text: `y de ${formData.bau_madre}`, style: "normal", endline: true },
            { text: `feligreses de NUESTRA SEÑORA DE LA MERCED "LA ARCADIA"`, style: "normal", endline: true },
            { text: "Fueron padrino (s)/ madrina(s)", style: "normal", endline: true },
            { text: `${formData.bau_padrinos}`, style: "normal", endline: true },
            { text: "a quien (es) se advirtió sus obligaciones y parentesco espiritual.", style: "normal", endline: true },
            { text: "Lo certifica:", style: "normal", endline: true },
            { text: `${formData.bau_mincert_nombre}`, style: "normal", endline: true },
            { text: "Son datos fielmente tomados del original.", style: "normal", endline: true },
            { text: "Lo certifico,", style: "bold", endline: true },
            { text: `${currentParishPriest.min_nombre}`, style: "normal", endline: true },
        ];

        let marginLeftParrafo = 80;
        currentY = currentY2;

        parrafo.forEach(line => {
            const fontType = line.style === "bold" ? "Georgia-Bold" : "Georgia";
            const fontStyle = line.style === "bold" ? "bold" : "normal";
            doc.setFont(fontType, fontStyle);

            let text = line.text;
            let textWidth = doc.getTextWidth(text);

            if (marginLeftParrafo + textWidth > maxWidth) {
                const splitText = doc.splitTextToSize(text, maxWidth - marginLeftParrafo);
                splitText.forEach((txtLine, index) => {

                    doc.text(txtLine, marginLeftParrafo, currentY);
                    marginLeftParrafo = 80;
                    currentY += lineHeight;

                });
            } else {
                doc.text(text, marginLeftParrafo, currentY);
                marginLeftParrafo += textWidth;
            }
            if (line.endline) {
                marginLeftParrafo = 80;
                currentY += lineHeight;
            }
        });

        currentY += lineHeight + 2;
        doc.setFont("Georgia-Bold", "bold");
        doc.text(`F. ___________________`, 150, currentY += lineHeight, null, null, 'center');
        doc.text(`${currentParishPriest.min_nombre}`, 150, currentY += lineHeight, null, null, 'center');
        doc.text("PÁRROCO", 150, currentY += lineHeight, null, null, 'center');


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
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: teal[300],
        '&:hover': {
            backgroundColor: teal[500],
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
                                        <div><strong>Tomo:</strong> {formData.bau_tomo}</div>
                                        <div><strong>Página:</strong> {formData.bau_pag}</div>
                                        <div><strong>Número:</strong> {formData.bau_num}</div>
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
                                        <div><strong>Tomo:</strong> {formData.bau_tomo_nac}</div>
                                        <div><strong>Página:</strong> {formData.bau_pag_nac}</div>
                                        <div><strong>Acta:</strong> {formData.bau_acta_nac}</div>
                                    </div>
                                    <p><strong>Cédula:</strong> {formData.bau_cedula}</p>
                                    <p><strong>Lugar de Nacimiento:</strong> {formData.bau_lugar_nac}</p>
                                    <p><strong>Fecha de Acta:</strong> {formData.bau_fecha_acta}</p>
                                    <p><strong>Año de Registro:</strong> {formData.bau_anio_acta}</p>
                                    <p><strong>Nota:</strong> {formData.bau_nota}</p>
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