import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { teal } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Checkbox from '@mui/material/Checkbox';
import './popup.css';
import '../../App.css';

const PopupMinistro = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        min_nombre: '',
        min_b_parroco: 0,
        min_parroco_actual: 0,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                min_nombre: '',
                min_b_parroco: 0,
                min_parroco_actual: 0,
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.min_nombre) {
            newErrors.min_nombre = 'El nombre del ministro es requerido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
        }
    }

    if (!isOpen) {
        return null;
    }

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
                <h2 className='h2-est'>{initialData ? 'Editar Ministro' : 'Agregar Ministro'}</h2>
                <div className="gridCentraoNoFull grid-2row-equal">
                    <div className='gridCentraoNoFull'>
                        <TextField
                            label="Nombre del ministro"
                            name="min_nombre"
                            value={formData.min_nombre}
                            onChange={handleChange}
                            error={errors.min_nombre}
                            helperText={errors.min_nombre}
                            fullWidth
                            autoComplete='one-time-code'
                        />
                        <div className='gridCentraoNoFull grid-2colum-noequal'>
                            <strong>¿Este ministro ha sido párroco?</strong>
                            <Checkbox
                                checked={formData.min_b_parroco == 1 ? true : false}
                                onChange={(event) => setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    min_b_parroco: event.target.checked ? 1 : 0,
                                    min_parroco_actual: event.target.checked ? prevFormData.min_parroco_actual : 0,
                                }))}
                                color="primary"
                            />
                        </div>
                        {formData.min_b_parroco == 1 ? (
                            <div className='gridCentraoNoFull grid-2colum-noequal'>
                                <strong>¿Este ministro es el párroco actualmente?</strong>
                                <Checkbox
                                    checked={formData.min_parroco_actual == 1}
                                    onChange={(event) => setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        min_parroco_actual: event.target.checked ? 1 : 0,
                                    }))}
                                    color="primary"
                                />
                            </div>
                        ) : null}
                    </div>
                    <div className="gridCentraoButtons grid-2colum-equal-lessSpace">
                        <ColorButton startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit}>Guardar</ColorButton>
                        <ColorButtonRed startIcon={<CloseIcon />} variant="contained" onClick={onClose}>Cancelar</ColorButtonRed>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupMinistro