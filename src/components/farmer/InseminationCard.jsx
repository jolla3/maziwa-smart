import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    Tabs,
    Tab,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    CameraAlt as CameraAltIcon,
    UploadFile as UploadFileIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const InseminationCard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { token } = useContext(AuthContext);

    const [animals, setAnimals] = useState([]);
    const [fetchAnimalsLoading, setFetchAnimalsLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [selectedAnimalId, setSelectedAnimalId] = useState('');
    const [formData, setFormData] = useState({
        insemination_date: '',
        inseminator: '',
        bull_breed: '',
        notes: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [ocrData, setOcrData] = useState(null);
    const [tabValue, setTabValue] = useState('1');

    const [error, setError] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const API_BASE_URL = 'https://maziwasmart.onrender.com/api/insemination';
    const COW_API_URL = 'https://maziwasmart.onrender.com/api/cow';

    // 🐄 Fetch only female cows and heifers for insemination
    const fetchAnimals = useCallback(async () => {
        if (!token) {
            setSnackbarMessage('Authentication failed. Please log in again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setFetchAnimalsLoading(false);
            return;
        }

        setFetchAnimalsLoading(true);
        try {
            const response = await axios.get(COW_API_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: { gender: 'female', stage: ['cow', 'heifer'] }
            });
            setAnimals(response.data.cows);
        } catch (err) {
            console.error('Failed to fetch animals:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to fetch animals. Check console for details.');
            setSnackbarMessage('Failed to fetch animals. Please try again later.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setFetchAnimalsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAnimals();
    }, [fetchAnimals]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        // Clear states when switching tabs
        setError(null);
        setOcrData(null);
        setImageFile(null);
        setFormData({
            insemination_date: '',
            inseminator: '',
            bull_breed: '',
            notes: '',
        });
        setSelectedAnimalId('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);
        try {
            const payload = {
                cow_id: selectedAnimalId,
                insemination_date: formData.insemination_date,
                inseminator: formData.inseminator,
                bull_breed: formData.bull_breed,
                notes: formData.notes,
            };

            await axios.post(API_BASE_URL, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSnackbarMessage('✅ Insemination record added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setFormData({
                insemination_date: '',
                inseminator: '',
                bull_breed: '',
                notes: '',
            });
            setSelectedAnimalId('');
        } catch (err) {
            console.error('Failed to add record:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to add record. Please try again.');
            setSnackbarMessage('❌ Failed to add record.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setFormLoading(false);
        }
    };

    const handleOcrUpload = async () => {
        if (!imageFile) {
            setSnackbarMessage('Please select an image to upload.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        setOcrLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('photo', imageFile);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload-card`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSnackbarMessage('⏳ OCR processing started. A record will be created if successful.');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
            setOcrData(response.data);
        } catch (err) {
            console.error('Failed to upload image for OCR:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Failed to process image. Please try again.');
            setSnackbarMessage('❌ Failed to upload image for OCR.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setOcrLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box m="20px">
            <Header
                title="INSEMINATION RECORDS"
                subtitle="Add new insemination records manually or by scanning a card"
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Grid container spacing={4} mt={2}>
                <Grid item xs={12} md={8} lg={6}>
                    <Card sx={{ background: colors.primary[400], borderRadius: '16px', p: 2, display: 'flex', flexDirection: 'column' }}>
                        <TabContext value={tabValue}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                                <TabList onChange={handleTabChange} aria-label="insemination-tabs">
                                    <Tab label="Manual Entry" value="1" icon={<AddCircleOutlineIcon />} />
                                    <Tab label="Scan Card (OCR)" value="2" icon={<CameraAltIcon />} />
                                </TabList>
                            </Box>

                            {/* Manual Entry Tab Panel */}
                            <TabPanel value="1" sx={{ p: 0 }}>
                                <Box component="form" onSubmit={handleManualSubmit}>
                                    <Box mb={3}>
                                        <FormControl fullWidth variant="filled" required>
                                            <InputLabel>Select Animal</InputLabel>
                                            <Select
                                                value={selectedAnimalId}
                                                onChange={(e) => setSelectedAnimalId(e.target.value)}
                                                disabled={fetchAnimalsLoading || formLoading}
                                            >
                                                {fetchAnimalsLoading ? (
                                                    <MenuItem disabled>Loading animals...</MenuItem>
                                                ) : animals.length > 0 ? (
                                                    animals.map((animal) => (
                                                        <MenuItem key={animal._id} value={animal._id}>
                                                            {animal.cow_name} ({animal.cow_id}) - {animal.stage}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled>No eligible female animals available.</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box mb={3}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="date"
                                            label="Insemination Date"
                                            name="insemination_date"
                                            value={formData.insemination_date}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Inseminator Name"
                                            name="inseminator"
                                            value={formData.inseminator}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Box>
                                    <Box mb={3}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Bull Breed"
                                            name="bull_breed"
                                            value={formData.bull_breed}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Box>
                                    <Box mb={4}>
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Notes (Optional)"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={4}
                                        />
                                    </Box>
                                    {error && (
                                        <Box mb={2}>
                                            <Alert severity="error">{error}</Alert>
                                        </Box>
                                    )}
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                        disabled={formLoading}
                                        sx={{ height: '56px' }}
                                        startIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />}
                                    >
                                        {formLoading ? 'Submitting...' : 'Add Record'}
                                    </Button>
                                </Box>
                            </TabPanel>

                            {/* Scan Card (OCR) Tab Panel */}
                            <TabPanel value="2" sx={{ p: 0 }}>
                                <Box>
                                    <Box mb={4} textAlign="center">
                                        <Button
                                            variant="contained"
                                            component="label"
                                            sx={{ mb: 2 }}
                                            color="secondary"
                                            startIcon={<UploadFileIcon />}
                                        >
                                            Select Image
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        {imageFile && (
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <Typography variant="body2" color={colors.grey[300]}>
                                                    Selected: {imageFile.name}
                                                </Typography>
                                                <Button onClick={() => setImageFile(null)} size="small" color="error" startIcon={<DeleteIcon />} />
                                            </Box>
                                        )}
                                    </Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleOcrUpload}
                                        color="success"
                                        disabled={ocrLoading || !imageFile}
                                        sx={{ height: '56px' }}
                                        startIcon={ocrLoading ? <CircularProgress size={20} color="inherit" /> : <CameraAltIcon />}
                                    >
                                        {ocrLoading ? 'Processing...' : 'Process Card (OCR)'}
                                    </Button>
                                    {error && (
                                        <Box mt={3}>
                                            <Alert severity="error">{error}</Alert>
                                        </Box>
                                    )}
                                    {ocrData && ocrData.raw_text && (
                                        <Box mt={3}>
                                            <Card sx={{ background: colors.primary[600], p: 2 }}>
                                                <CardContent>
                                                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
                                                        Extracted Text:
                                                    </Typography>
                                                    <Typography variant="body2" color={colors.grey[200]} sx={{ whiteSpace: 'pre-wrap' }}>
                                                        {ocrData.raw_text}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    )}
                                </Box>
                            </TabPanel>
                        </TabContext>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InseminationCard;