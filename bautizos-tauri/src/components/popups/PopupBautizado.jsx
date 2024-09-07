import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { invoke } from '@tauri-apps/api/tauri';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useUser } from '../../UserContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { blueGrey } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import './popup.css';
import '../../App.css';

const PopupBautizado = ({ isOpen, onClose, onSave, initialData }) => {
    const { user } = useUser();
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
        bau_tomo_nac: 0,
        bau_pag_nac: 0,
        bau_acta_nac: 0,
        bau_nota: '',
    });
    const [errors, setErrors] = useState({});
    const [ministros, setMinistros] = useState([]);
    const [ministrosParrocos, setMinistrosParrocos] = useState([]);

    useEffect(() => {
        const fetchMinistros = async () => {
            const response = await invoke('get_all_ministros');
            setMinistrosParrocos(response.filter((ministro) => ministro.min_b_parroco === 1));
            setMinistros(response);
        };

        fetchMinistros();
    }, []);

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
            });
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (!isOpen) {
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

    const handleDateNacChange = (date) => {
        setFormData({ ...formData, bau_fecha_nac: date.format('YYYY-MM-DD') });
    };
    const handleDateBauChange = (date) => {
        setFormData({ ...formData, bau_fecha_bau: date.format('YYYY-MM-DD') });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
            setErrors({ ...errors, [name]: true });
        } else {
            setErrors({ ...errors, [name]: false });
        }
    };

    const handleAutocompleteChange = (event, value, field) => {
        switch (field) {
            case "bau_min_bau":
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    bau_min_bau: value ? value.min_id : null,
                }));
                break;
            case "bau_min_cert":
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    bau_min_cert: value ? value.min_id : null,
                }));
                break;
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.bau_nombres) newErrors.bau_nombres = true;
        if (!formData.bau_apellidos) newErrors.bau_apellidos = true;
        if (!formData.bau_cedula) newErrors.bau_cedula = true;
        if (formData.bau_cedula.length != 10) newErrors.bau_cedula_length = true;
        if (!formData.bau_fecha_nac) newErrors.bau_fecha_nac = true;
        if (!formData.bau_lugar_nac) newErrors.bau_lugar_nac = true;
        if (!formData.bau_min_bau) newErrors.bau_min_bau = true;
        if (!formData.bau_padre) newErrors.bau_padre = true;
        if (!formData.bau_madre) newErrors.bau_madre = true;
        if (!formData.bau_padrinos) newErrors.bau_padrinos = true;
        if (!formData.bau_min_cert) newErrors.bau_min_cert = true;
        if (!formData.bau_fecha_bau) newErrors.bau_fecha_bau = true;
        if (!formData.bau_tomo) newErrors.bau_tomo = true;
        if (!formData.bau_pag) newErrors.bau_pag = true;
        if (!formData.bau_num) newErrors.bau_num = true;
        if (!formData.bau_tomo_nac) newErrors.bau_tomo_nac = true;
        if (!formData.bau_pag_nac) newErrors.bau_pag_nac = true;
        if (!formData.bau_acta_nac) newErrors.bau_acta_nac = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        console.log("antes de validar");
        if (validateForm()) {
            formData.bau_tomo = Number(formData.bau_tomo);
            formData.bau_pag = Number(formData.bau_pag);
            formData.bau_num = Number(formData.bau_num);
            formData.bau_tomo_nac = Number(formData.bau_tomo_nac);
            formData.bau_pag_nac = Number(formData.bau_pag_nac);
            formData.bau_acta_nac = Number(formData.bau_acta_nac);
            formData.bau_min_bau = Number(formData.bau_min_bau);
            formData.bau_min_cert = Number(formData.bau_min_cert);

            console.log(formData);
            onSave(formData);
        }
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
                    <div className='gridCentrao'>
                        <h2>{initialData ? 'Editar Bautizado' : 'Agregar Bautizado'}</h2>
                    </div>
                    <div className='gridTop cartas grid-2colum-noequal'>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <div className="gridCentraoNoFull2 form">
                                    <h2>Datos de Bautizo</h2>
                                    <div className='gridCentraoNoFull grid-2colum-equal input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Nombres del Bautizado"
                                            name="bau_nombres"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleChange}
                                            value={formData.bau_nombres}
                                            error={errors.bau_nombres}
                                            helperText={errors.bau_nombres ? 'Campo obligatorio' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <TextField
                                            fullWidth
                                            label="Apellidos del Bautizado"
                                            name="bau_apellidos"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleChange}
                                            value={formData.bau_apellidos}
                                            error={errors.bau_apellidos}
                                            helperText={errors.bau_apellidos ? 'Campo obligatorio' : ''}
                                            autoComplete='one-time-code'
                                        />
                                    </div>
                                    <div className='gridCentraoNoFull grid-2colum-equal input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Padre del Bautizado"
                                            name="bau_padre"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleChange}
                                            value={formData.bau_padre}
                                            error={errors.bau_padre}
                                            helperText={errors.bau_padre ? 'Campo obligatorio' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <TextField
                                            fullWidth
                                            label="Madre del Bautizado"
                                            name="bau_madre"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleChange}
                                            value={formData.bau_madre}
                                            error={errors.bau_madre}
                                            helperText={errors.bau_madre ? 'Campo obligatorio' : ''}
                                            autoComplete='one-time-code'
                                        />
                                    </div>
                                    <div className='gridCentraoNoFull grid-2colum-equal input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Padrinos del Bautizado"
                                            name="bau_padrinos"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleChange}
                                            value={formData.bau_padrinos}
                                            error={errors.bau_padrinos}
                                            helperText={errors.bau_padrinos ? 'Campo obligatorio' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                            <DatePicker
                                                label="Fecha de Bautizo"
                                                value={dayjs(formData.bau_fecha_bau).locale('es')}
                                                onChange={handleDateBauChange}
                                                textField={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className='gridCentraoNoFull grid-2colum-equal  input-separado'>
                                        <Autocomplete
                                            fullWidth
                                            options={ministros}
                                            size="small"
                                            getOptionLabel={(option) => option.min_nombre}
                                            onChange={(event, value) => handleAutocompleteChange(event, value, 'bau_min_bau')}
                                            value={ministros.find((ministro) => ministro.min_id === formData.bau_min_bau) || null}
                                            renderInput={(params) => <TextField {...params} label="Ministro de Bautizo" />}
                                        />
                                        <Autocomplete
                                            fullWidth
                                            options={ministrosParrocos}
                                            size="small"
                                            getOptionLabel={(option) => option.min_nombre}
                                            onChange={(event, value) => handleAutocompleteChange(event, value, 'bau_min_cert')}
                                            value={ministros.find((ministro) => ministro.min_id === formData.bau_min_cert) || null}
                                            renderInput={(params) => <TextField {...params} label="Ministro Certifica" />}
                                        />
                                    </div>
                                    <div className='gridCentraoNoFull input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Notas"
                                            name="bau_nota"
                                            onChange={handleChange}
                                            onBlur={handleChange}
                                            value={formData.bau_nota}
                                            autoComplete='one-time-code'
                                        />
                                    </div>
                                    <div className='gridCentraoNoFull grid-3colum-equal input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Tomo"
                                            name="bau_tomo"
                                            size="small"
                                            type='number'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.bau_tomo}
                                            error={errors.bau_tomo}
                                            helperText={errors.bau_tomo ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <TextField
                                            fullWidth
                                            label="Página"
                                            name="bau_pag"
                                            size="small"
                                            type='number'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.bau_pag}
                                            error={errors.bau_pag}
                                            helperText={errors.bau_pag ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <TextField
                                            fullWidth
                                            label="Número"
                                            name="bau_num"
                                            size="small"
                                            type='number'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.bau_num}
                                            error={errors.bau_num}
                                            helperText={errors.bau_num ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <div className="gridCentraoNoFull2">
                                    <h2>Datos Registro Civil</h2>
                                </div>
                                <div >
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                        <DatePicker
                                            label="Fecha de Nacimiento"
                                            value={dayjs(formData.bau_fecha_nac).locale('es')}
                                            onChange={handleDateNacChange}
                                            textField={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>

                                    <div className='input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Cédula del Bautizado"
                                            name="bau_cedula"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleChange}
                                            value={formData.bau_cedula}
                                            error={errors.bau_cedula}
                                            helperText={
                                                errors.bau_cedula
                                                    ? 'Campo obligatorio'
                                                    : errors.bau_cedula_length
                                                        ? 'La cédula debe ser exactamente 10 caracteres'
                                                        : ''
                                            }
                                            autoComplete='one-time-code'
                                        />
                                    </div>

                                    <div className='input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Lugar de Nacimiento"
                                            name="bau_lugar_nac"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleChange}
                                            value={formData.bau_lugar_nac}
                                            error={errors.bau_lugar_nac}
                                            helperText={errors.bau_lugar_nac ? 'Campo obligatorio' : ''}
                                            autoComplete='one-time-code'
                                        />
                                    </div>

                                    <div className='gridCentraoNoFull grid-3colum-equal input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Tomo"
                                            name="bau_tomo_nac"
                                            size="small"
                                            type='number'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.bau_tomo_nac}
                                            error={errors.bau_tomo_nac}
                                            helperText={errors.bau_tomo_nac ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <TextField
                                            fullWidth
                                            label="Página"
                                            name="bau_pag_nac"
                                            size="small"
                                            type='number'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.bau_pag_nac}
                                            error={errors.bau_pag_nac}
                                            helperText={errors.bau_pag_nac ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <TextField
                                            fullWidth
                                            label="Acta"
                                            name="bau_acta_nac"
                                            size="small"
                                            type='number'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.bau_acta_nac}
                                            error={errors.bau_acta_nac}
                                            helperText={errors.bau_acta_nac ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
                <br></br>
                <div className='gridCentrao'>
                    <div className="gridCentraoButtons grid-2colum-equal-lessSpace  input-separado">
                        <ColorButton startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit}>Guardar</ColorButton>
                        <ColorButtonRed startIcon={<CloseIcon />} variant="contained" onClick={onClose}>Cancelar</ColorButtonRed>

                    </div>

                </div>

            </div>
        </div >
    );
};

export default PopupBautizado;
