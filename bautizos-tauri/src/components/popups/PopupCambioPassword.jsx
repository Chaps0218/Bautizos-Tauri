import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import TextField from '@mui/material/TextField';
import { useUser } from '../../UserContext';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { amber } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import './popup.css';
import '../../App.css';

const PopupCambioPassword = ({ isOpen, onClose }) => {
    const { user } = useUser();

    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const checkPassword = async () => {
        try {
            const response = await invoke('check_password', { input: formData.password, input2: user.usu_id });
            console.log('response', response);
            return response;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                password: '',
                newPassword: '',
                confirmPassword: ''
            });
            setErrors({});
            setIsPasswordCorrect(false);
        }
    }, [isOpen]);

    const validateForm = async () => {
        const newErrors = {};
        if (!formData.password) {
            newErrors.password = 'La contraseña anterior es requerida';
        } else {
            const isPasswordCorrect = await checkPassword();
            if (!isPasswordCorrect) {
                newErrors.password = "La contraseña ingresada no coincide con la anterior";
            }
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña es requerida';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmación de la contraseña es requerida';
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.newPassword = 'Las contraseñas no coinciden';
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log('user.usu_id', user.usu_id);
            console.log('formData.newPassword', formData.newPassword);
            console.log('formData.password', formData.password);
            if (await validateForm()) {
                const response = await invoke('handle_save_password', { input: formData.newPassword, input2: user.usu_id });
                if (response) {
                    onClose();
                } else {
                    setErrors({ message: 'Error al cambiar la contraseña' });
                }
            }
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Error al cambiar la contraseña' });
        }
        setLoading(false);
    };

    if (!isOpen) {
        return null;
    }

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(amber[600]),
        backgroundColor: amber[600],
        '&:hover': {
            backgroundColor: amber[900],
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
                <h2 className='h2-est'>Cambiar Contraseña</h2>
                <div className="gridCentraoNoFull grid-2row-equal">
                    <div className='gridCentraoNoFull grid-3row-equal-moreSpace '>
                        <TextField
                            label="Contraseña antigua"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                            autoComplete='one-time-code'
                        />
                        <TextField
                            label="Contraseña nueva"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                            fullWidth
                            autoComplete='one-time-code'
                        />
                        <TextField
                            label="Repetir contraseña nueva"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            fullWidth
                            autoComplete='one-time-code'
                        />
                    </div>
                    <div className="gridCentraoButtons grid-2colum-equal-lessSpace">
                        <ColorButton startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit}>Guardar</ColorButton>
                        <ColorButtonRed startIcon={<CloseIcon />} variant="contained" onClick={onClose}>Cancelar</ColorButtonRed>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupCambioPassword;
