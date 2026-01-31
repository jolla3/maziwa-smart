import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
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
    Container,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import {
    Add as AddIcon,
    Videocam as VideocamIcon,
    Upload as UploadIcon,
    Delete as DeleteIcon,
    ListAlt as ListAltIcon,
    Check as CheckIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const REPRODUCTIVE_STAGES = {
    cow: ['heifer', 'cow'],
    goat: ['doe'],
    sheep: ['ewe'],
    pig: ['sow'],
};

const STAGE_LABELS = {
    heifer: 'Heifer (Not Calved)',
    cow: 'Adult Cow',
    doe: 'Adult Doe',
    ewe: 'Adult Ewe',
    sow: 'Adult Sow',
};

const SPECIES_LABELS = {
    cow: 'Cattle',
    goat: 'Goats',
    sheep: 'Sheep',
    pig: 'Pigs',
};

// FIXED: Correct sire naming by species
const SIRE_LABELS = {
    cow: 'Bull',
    goat: 'Buck',
    sheep: 'Ram',
    pig: 'Boar',
};

const InseminationCard = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const prevSpeciesRef = useRef(null);

    const [allAnimals, setAllAnimals] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [fetchAnimalsLoading, setFetchAnimalsLoading] = useState(true);
    const [fetchBreedsLoading, setFetchBreedsLoading] = useState(false);

    const [formLoading, setFormLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [selectedAnimalId, setSelectedAnimalId] = useState('');
    const [selectedBreedId, setSelectedBreedId] = useState('');
    const [bullSource, setBullSource] = useState('');
    const [tabValue, setTabValue] = useState('1');

    const [formData, setFormData] = useState({
        insemination_date: '',
        inseminator: '',
        bull_breed_manual: '',
        bull_code: '',
        bull_name: '',
        notes: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [ocrData, setOcrData] = useState(null);
    const [error, setError] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const API_BASE_URL = process.env.REACT_APP_API_BASE;

    const fetchAnimals = useCallback(async () => {
        if (!token) {
            setSnackbarMessage('Authentication failed.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setFetchAnimalsLoading(false);
            return;
        }

        setFetchAnimalsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/animals`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { gender: 'female' }
            });

            const normalized = (response.data.animals || response.data.cows || []).map(animal => ({
                id: animal._id || animal.id,
                _id: animal._id || animal.id,
                ...animal
            }));

            setAllAnimals(normalized);
        } catch (err) {
            console.error('Failed to fetch animals:', err);
            setError('Failed to fetch animals.');
        } finally {
            setFetchAnimalsLoading(false);
        }
    }, [token, API_BASE_URL]);

    const fetchBreeds = useCallback(async (species, signal) => {
        if (!token || !species) {
            setBreeds([]);
            return;
        }

        setFetchBreedsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/breed`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { animal_species: species },
                signal
            });

            if (!signal.aborted) {
                setBreeds(response.data.breeds || []);
            }
        } catch (err) {
            if (!signal.aborted) {
                console.error('Failed to fetch breeds:', err);
                setBreeds([]);
            }
        } finally {
            if (!signal.aborted) {
                setFetchBreedsLoading(false);
            }
        }
    }, [token, API_BASE_URL]);

    useEffect(() => {
        fetchAnimals();
    }, [fetchAnimals]);

    useEffect(() => {
        const controller = new AbortController();
        if (selectedSpecies) {
            fetchBreeds(selectedSpecies, controller.signal);
        } else {
            setBreeds([]);
        }
        return () => controller.abort();
    }, [selectedSpecies, fetchBreeds]);

    // Auto-select manual mode if no breeds exist for selected species
    useEffect(() => {
        if (selectedSpecies && breeds.length === 0 && !fetchBreedsLoading && !bullSource) {
            setBullSource('manual');
        }
    }, [selectedSpecies, breeds.length, bullSource, fetchBreedsLoading]);

    // FIXED 4: Derive species from eligible females only
    const availableSpecies = useMemo(() => {
        const valid = ['cow', 'goat', 'sheep', 'pig'];
        const eligible = allAnimals.filter(a =>
            a.gender === 'female' &&
            valid.includes(a.species) &&
            REPRODUCTIVE_STAGES[a.species]
        );
        const unique = [...new Set(eligible.map(a => a.species).filter(Boolean))];
        return unique.sort();
    }, [allAnimals]);

    // Eligible animals for selected species
    const eligibleAnimals = useMemo(() => {
        if (!selectedSpecies) return [];

        const allowedStages = REPRODUCTIVE_STAGES[selectedSpecies] || [];

        return allAnimals.filter(animal =>
            animal.species === selectedSpecies &&
            animal.gender === 'female' &&
            allowedStages.includes(animal.stage)
        );
    }, [selectedSpecies, allAnimals]);

    // Build animal menu items
    const animalMenuItems = useMemo(() => {
        if (!selectedSpecies) return [];

        const allowedStages = REPRODUCTIVE_STAGES[selectedSpecies] || [];
        const result = [];

        allowedStages.forEach((stage, stageIdx) => {
            const animalsInStage = eligibleAnimals.filter(a => a.stage === stage);

            if (animalsInStage.length > 0) {
                result.push({
                    type: 'header',
                    key: `header-${stageIdx}`,
                    label: STAGE_LABELS[stage] || stage
                });

                animalsInStage.forEach((animal) => {
                    result.push({
                        type: 'item',
                        key: animal.id,
                        value: animal.id,
                        label: `${animal.cow_name} • ${STAGE_LABELS[animal.stage] || animal.stage}`,
                        animal
                    });
                });
            }
        });

        return result;
    }, [selectedSpecies, eligibleAnimals]);

    // Memoize selected animal
    const selectedAnimal = useMemo(
        () => allAnimals.find(a => a.id === selectedAnimalId),
        [allAnimals, selectedAnimalId]
    );

    // Memoize selected breed
    const selectedBreed = useMemo(
        () => breeds.find(b => b._id === selectedBreedId),
        [breeds, selectedBreedId]
    );

    // FIXED: Smart species reset
    const handleSpeciesChange = (species) => {
        setSelectedSpecies(species);

        if (prevSpeciesRef.current !== species) {
            setSelectedAnimalId('');
            setSelectedBreedId('');
            setBullSource('');
        }

        prevSpeciesRef.current = species;
    };

    const handleAnimalChange = (animalId) => {
        setSelectedAnimalId(animalId);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError(null);
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

    const handleBullSourceChange = (source) => {
        setBullSource(source);
        if (source === 'profile') {
            setFormData({
                ...formData,
                bull_breed_manual: '',
                bull_code: '',
                bull_name: '',
            });
        } else if (source === 'manual') {
            setSelectedBreedId('');
        }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!selectedSpecies) {
            setError('Select a species.');
            return;
        }

        if (!selectedAnimalId) {
            setError('Select an animal.');
            return;
        }

        // Frontend eligibility guard
        if (selectedAnimal && !REPRODUCTIVE_STAGES[selectedSpecies]?.includes(selectedAnimal.stage)) {
            setError('Selected animal is not eligible for insemination.');
            return;
        }

        // FIXED: No bull source required if manual breed available
        if (!bullSource) {
            setError('Choose: use existing breed or enter manually.');
            return;
        }

        if (bullSource === 'profile' && !selectedBreedId) {
            setError('Select a breed profile.');
            return;
        }

        if (bullSource === 'manual' && !formData.bull_breed_manual) {
            setError(`Enter ${SIRE_LABELS[selectedSpecies]} breed.`);
            return;
        }

        if (!formData.insemination_date) {
            setError('Enter insemination date.');
            return;
        }

        if (!formData.inseminator) {
            setError('Enter inseminator name.');
            return;
        }

        setFormLoading(true);

        try {
            let payload = {
                animal_id: selectedAnimalId,
                insemination_date: formData.insemination_date,
                inseminator: formData.inseminator,
                notes: formData.notes || undefined,
            };

            if (bullSource === 'profile') {
                payload.bull_profile_id = selectedBreedId;
            } else {
                payload.bull_manual = {
                    bull_breed: formData.bull_breed_manual,
                    bull_code: formData.bull_code || undefined,
                    bull_name: formData.bull_name || undefined,
                };
            }

            await axios.post(`${API_BASE_URL}/insemination`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const message = bullSource === 'manual'
                ? 'Insemination recorded. New breed saved.'
                : 'Insemination recorded successfully.';

            setSnackbarMessage(message);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setFormData({
                insemination_date: '',
                inseminator: '',
                bull_breed_manual: '',
                bull_code: '',
                bull_name: '',
                notes: '',
            });
            setSelectedSpecies('');
            setSelectedAnimalId('');
            setSelectedBreedId('');
            setBullSource('');
            prevSpeciesRef.current = null;
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Failed to record insemination.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleOcrUpload = async () => {
        if (!imageFile) {
            setSnackbarMessage('Select an image.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        setOcrLoading(true);
        setError(null);
        const formDataObj = new FormData();
        formDataObj.append('photo', imageFile);

        try {
            const response = await axios.post(`${API_BASE_URL}/insemination/upload-card`, formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSnackbarMessage('Card processed.');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
            setOcrData(response.data);
        } catch (err) {
            console.error('OCR error:', err);
            setError(err.response?.data?.message || 'Failed to process card.');
        } finally {
            setOcrLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const aqua = '#17a2b8';
    const aquaLight = '#e8f4f8';
    const aquaDark = '#138496';
    const white = '#ffffff';
    const black = '#000000';
    const lightBg = '#f8f9fa';

    return (
        <Box sx={{ background: white, minHeight: '100vh', py: '40px' }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h4" sx={{ color: black, fontWeight: 700, mb: 0.5 }}>
                            Insemination Recording
                        </Typography>
                        <Typography variant="body1" sx={{ color: black, fontWeight: 500 }}>
                            Record animal breeding events
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            background: aqua,
                            color: white,
                            textTransform: 'none',
                            fontWeight: 600,
                            padding: '10px 24px',
                            borderRadius: '6px',
                            '&:hover': { background: aquaDark, transition: 'all 0.3s ease' }
                        }}
                        startIcon={<ListAltIcon />}
                        onClick={() => navigate('/insemination-record')}
                    >
                        View Records
                    </Button>
                </Box>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <Card sx={{ background: white, border: `1px solid #e0e0e0`, borderRadius: '8px', overflow: 'hidden' }}>
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: `3px solid ${aqua}` }}>
                            <TabList
                                onChange={handleTabChange}
                                sx={{
                                    '& .MuiTab-root': {
                                        color: black,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&.Mui-selected': { color: aqua }
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: aqua,
                                        height: '3px'
                                    }
                                }}
                            >
                                <Tab label="Manual Entry" value="1" icon={<AddIcon />} iconPosition="start" />
                                <Tab label="Scan Card" value="2" icon={<VideocamIcon />} iconPosition="start" />
                            </TabList>
                        </Box>

                        <TabPanel value="1" sx={{ p: 3 }}>
                            <Box component="form" onSubmit={handleManualSubmit}>
                                <Box mb={4}>
                                    <Typography variant="subtitle1" sx={{ color: black, fontWeight: 700, mb: 2 }}>
                                        Species
                                    </Typography>
                                    {availableSpecies.length > 0 ? (
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {availableSpecies.map(species => (
                                                <Button
                                                    key={species}
                                                    variant={selectedSpecies === species ? 'contained' : 'outlined'}
                                                    onClick={() => handleSpeciesChange(species)}
                                                    sx={{
                                                        background: selectedSpecies === species ? aqua : 'transparent',
                                                        color: selectedSpecies === species ? white : aqua,
                                                        border: `2px solid ${aqua}`,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        borderRadius: '6px',
                                                        '&:hover': {
                                                            background: selectedSpecies === species ? aquaDark : aquaLight
                                                        }
                                                    }}
                                                >
                                                    {SPECIES_LABELS[species]}
                                                </Button>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Alert severity="warning">No animals available.</Alert>
                                    )}
                                </Box>

                                {selectedSpecies && (
                                    <>
                                        <Box mb={4}>
                                            <Typography variant="subtitle1" sx={{ color: black, fontWeight: 700, mb: 1 }}>
                                                Select Animal
                                            </Typography>

                                            {eligibleAnimals.length > 0 ? (
                                                <FormControl fullWidth required>
                                                    <InputLabel sx={{ color: black }}>Female Animal</InputLabel>
                                                    <Select
                                                        value={selectedAnimalId}
                                                        onChange={(e) => handleAnimalChange(e.target.value)}
                                                        label="Female Animal"
                                                        sx={{
                                                            background: lightBg,
                                                            color: black,
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d0d0' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: aqua },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: aqua },
                                                        }}
                                                    >
                                                        {animalMenuItems.map((item) =>
                                                            item.type === 'header' ? (
                                                                <MenuItem
                                                                    key={item.key}
                                                                    disabled
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        color: black,
                                                                        backgroundColor: '#f5f5f5'
                                                                    }}
                                                                >
                                                                    {item.label}
                                                                </MenuItem>
                                                            ) : (
                                                                <MenuItem
                                                                    key={item.key}
                                                                    value={item.value}
                                                                    sx={{ pl: 4 }}
                                                                >
                                                                    {item.label}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <Alert severity="info">
                                                    No reproductively eligible females for {SPECIES_LABELS[selectedSpecies]}.
                                                    <br />
                                                    Calves and juveniles are excluded from insemination.
                                                </Alert>
                                            )}

                                            {selectedAnimal && (
                                                <Paper sx={{ mt: 2, p: 2, background: aquaLight, border: `1px solid ${aqua}` }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                        <CheckIcon sx={{ color: aqua, fontSize: '20px' }} />
                                                        <Typography variant="body2" sx={{ color: black, fontWeight: 600 }}>
                                                            {selectedAnimal.cow_name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: black }}>
                                                        Breed: {selectedAnimal.breed} | Stage: {STAGE_LABELS[selectedAnimal.stage] || selectedAnimal.stage}
                                                    </Typography>
                                                </Paper>
                                            )}
                                        </Box>

                                        <Box mb={4}>
                                            <Typography variant="subtitle1" sx={{ color: black, fontWeight: 700, mb: 2 }}>
                                                {SIRE_LABELS[selectedSpecies]} Information
                                            </Typography>

                                            {/* FIXED: Manual entry always available, no requirement for pre-recorded breeds */}
                                            {breeds.length > 0 ? (
                                                <RadioGroup
                                                    value={bullSource}
                                                    onChange={(e) => handleBullSourceChange(e.target.value)}
                                                    sx={{ mb: 3 }}
                                                >
                                                    <FormControlLabel
                                                        value="profile"
                                                        control={<Radio sx={{ color: aqua, '&.Mui-checked': { color: aqua } }} />}
                                                        label={`Use Recorded ${SIRE_LABELS[selectedSpecies]} (${breeds.length} available)`}
                                                        sx={{ color: black, fontWeight: 500 }}
                                                    />
                                                    <FormControlLabel
                                                        value="manual"
                                                        control={<Radio sx={{ color: aqua, '&.Mui-checked': { color: aqua } }} />}
                                                        label={`Enter ${SIRE_LABELS[selectedSpecies]} Manually`}
                                                        sx={{ color: black, fontWeight: 500 }}
                                                    />
                                                </RadioGroup>
                                            ) : (
                                                <Alert severity="info" sx={{ mb: 2 }}>
                                                    No recorded {SIRE_LABELS[selectedSpecies].toLowerCase()} profiles yet. Enter manually.
                                                </Alert>
                                            )}

                                            {/* Breed Profile Selection */}
                                            {bullSource === 'profile' && (
                                                <Box>
                                                    <FormControl fullWidth required>
                                                        <InputLabel sx={{ color: black }}>Select {SIRE_LABELS[selectedSpecies]}</InputLabel>
                                                        <Select
                                                            value={selectedBreedId}
                                                            onChange={(e) => setSelectedBreedId(e.target.value)}
                                                            disabled={fetchBreedsLoading}
                                                            label={`Select ${SIRE_LABELS[selectedSpecies]}`}
                                                            sx={{
                                                                background: lightBg,
                                                                color: black,
                                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d0d0' },
                                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: aqua },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: aqua },
                                                            }}
                                                        >
                                                            {breeds.map(breed => (
                                                                <MenuItem key={breed._id} value={breed._id}>
                                                                    {breed.breed_name} {breed.bull_name ? `(${breed.bull_name})` : ''}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                    {selectedBreed && (
                                                        <Paper sx={{ mt: 2, p: 2, background: aquaLight, border: `1px solid ${aqua}` }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                <InfoIcon sx={{ color: aqua, fontSize: '20px' }} />
                                                                <Typography variant="body2" sx={{ color: black, fontWeight: 600 }}>
                                                                    Profile Details
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="body2" sx={{ color: black }}>
                                                                <strong>Breed:</strong> {selectedBreed.breed_name}
                                                            </Typography>
                                                            {selectedBreed.bull_name && (
                                                                <Typography variant="body2" sx={{ color: black }}>
                                                                    <strong>Name:</strong> {selectedBreed.bull_name}
                                                                </Typography>
                                                            )}
                                                            {selectedBreed.bull_code && (
                                                                <Typography variant="body2" sx={{ color: black }}>
                                                                    <strong>Code:</strong> {selectedBreed.bull_code}
                                                                </Typography>
                                                            )}
                                                        </Paper>
                                                    )}
                                                </Box>
                                            )}

                                            {/* Manual Entry - Always available */}
                                            {bullSource === 'manual' && (
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            label={`${SIRE_LABELS[selectedSpecies]} Breed`}
                                                            name="bull_breed_manual"
                                                            value={formData.bull_breed_manual}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder="e.g., Friesian, Brahman"
                                                            sx={{
                                                                background: lightBg,
                                                                '& .MuiOutlinedInput-root': {
                                                                    '& fieldset': { borderColor: '#d0d0d0' },
                                                                    '&:hover fieldset': { borderColor: aqua },
                                                                    '&.Mui-focused fieldset': { borderColor: aqua },
                                                                },
                                                                '& .MuiInputBase-input': { color: black }
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label={`${SIRE_LABELS[selectedSpecies]} Code (Optional)`}
                                                            name="bull_code"
                                                            value={formData.bull_code}
                                                            onChange={handleInputChange}
                                                            placeholder="e.g., B-001"
                                                            sx={{
                                                                background: lightBg,
                                                                '& .MuiOutlinedInput-root': {
                                                                    '& fieldset': { borderColor: '#d0d0d0' },
                                                                    '&:hover fieldset': { borderColor: aqua },
                                                                    '&.Mui-focused fieldset': { borderColor: aqua },
                                                                },
                                                                '& .MuiInputBase-input': { color: black }
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label={`${SIRE_LABELS[selectedSpecies]} Name (Optional)`}
                                                            name="bull_name"
                                                            value={formData.bull_name}
                                                            onChange={handleInputChange}
                                                            placeholder="e.g., King"
                                                            sx={{
                                                                background: lightBg,
                                                                '& .MuiOutlinedInput-root': {
                                                                    '& fieldset': { borderColor: '#d0d0d0' },
                                                                    '&:hover fieldset': { borderColor: aqua },
                                                                    '&.Mui-focused fieldset': { borderColor: aqua },
                                                                },
                                                                '& .MuiInputBase-input': { color: black }
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Box>

                                        {/* Insemination Details */}
                                        <Box mb={3}>
                                            <Typography variant="subtitle1" sx={{ color: black, fontWeight: 700, mb: 2 }}>
                                                Insemination Details
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        type="date"
                                                        label="Insemination Date"
                                                        name="insemination_date"
                                                        value={formData.insemination_date}
                                                        onChange={handleInputChange}
                                                        InputLabelProps={{ shrink: true }}
                                                        required
                                                        sx={{
                                                            background: lightBg,
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': { borderColor: '#d0d0d0' },
                                                                '&:hover fieldset': { borderColor: aqua },
                                                                '&.Mui-focused fieldset': { borderColor: aqua },
                                                            },
                                                            '& .MuiInputBase-input': { color: black }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Inseminator"
                                                        name="inseminator"
                                                        value={formData.inseminator}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Technician name"
                                                        sx={{
                                                            background: lightBg,
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': { borderColor: '#d0d0d0' },
                                                                '&:hover fieldset': { borderColor: aqua },
                                                                '&.Mui-focused fieldset': { borderColor: aqua },
                                                            },
                                                            '& .MuiInputBase-input': { color: black }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Notes (Optional)"
                                                        name="notes"
                                                        value={formData.notes}
                                                        onChange={handleInputChange}
                                                        multiline
                                                        rows={3}
                                                        placeholder="Any relevant observations..."
                                                        sx={{
                                                            background: lightBg,
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': { borderColor: '#d0d0d0' },
                                                                '&:hover fieldset': { borderColor: aqua },
                                                                '&.Mui-focused fieldset': { borderColor: aqua },
                                                            },
                                                            '& .MuiInputBase-input': { color: black }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            disabled={formLoading || (eligibleAnimals.length === 0 && !selectedAnimal)}
                                            sx={{
                                                height: '48px',
                                                background: aqua,
                                                color: white,
                                                fontWeight: 700,
                                                borderRadius: '6px',
                                                fontSize: '1rem',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { background: aquaDark },
                                                '&:disabled': { background: '#ccc' }
                                            }}
                                            startIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                                        >
                                            {formLoading ? 'Recording...' : 'Record Insemination'}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </TabPanel>

                        <TabPanel value="2" sx={{ p: 3 }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: black, mb: 3 }}>
                                    Upload a photo of an insemination card for automatic extraction.
                                </Typography>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{
                                            mb: 2,
                                            background: aqua,
                                            color: white,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&:hover': { background: aquaDark, transition: 'all 0.3s ease' }
                                        }}
                                        startIcon={<UploadIcon />}
                                    >
                                        Select Image
                                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    </Button>

                                    {imageFile && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" sx={{ color: black }}>
                                                Selected: {imageFile.name}
                                            </Typography>
                                            <Button onClick={() => setImageFile(null)} size="small" color="error" startIcon={<DeleteIcon />} sx={{ mt: 1 }}>
                                                Remove
                                            </Button>
                                        </Box>
                                    )}
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleOcrUpload}
                                    disabled={!imageFile || ocrLoading}
                                    sx={{
                                        mt: 3,
                                        height: '48px',
                                        background: aqua,
                                        color: white,
                                        fontWeight: 700,
                                        borderRadius: '6px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { background: aquaDark },
                                        '&:disabled': { background: '#ccc' }
                                    }}
                                    startIcon={ocrLoading ? <CircularProgress size={20} color="inherit" /> : <VideocamIcon />}
                                >
                                    {ocrLoading ? 'Processing...' : 'Scan Card'}
                                </Button>

                                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                                {ocrData?.raw_text && (
                                    <Paper sx={{ mt: 3, p: 2, background: aquaLight, border: `1px solid ${aqua}` }}>
                                        <Typography variant="subtitle2" sx={{ color: black, fontWeight: 700, mb: 1 }}>
                                            Extracted Text
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: black, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                            {ocrData.raw_text}
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        </TabPanel>
                    </TabContext>
                </Card>
            </Container>
        </Box>
    );
};

export default InseminationCard;