import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Snackbar,
    InputAdornment,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    CalendarToday as CalendarIcon,
    Pets as PetsIcon,
    CheckCircle as CheckCircleIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../../PrivateComponents/AuthContext';

const InseminationRecordsList = () => {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext);

    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOutcome, setFilterOutcome] = useState('all');
    const [filterSpecies, setFilterSpecies] = useState('all');

    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [editFormData, setEditFormData] = useState({
        insemination_date: '',
        inseminator: '',
        bull_breed: '',
        outcome: '',
        notes: '',
    });

    const API_BASE_URL = process.env.REACT_APP_API_BASE;

    if (!API_BASE_URL) {
        console.error('API_BASE_URL is not defined. Please check your environment variables.');
        // Optionally, you can set a fallback or throw an error
        // throw new Error('API_BASE_URL is required');
    }

    const fetchRecords = async () => {
        if (!API_BASE_URL) return; // Skip if not defined
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/insemination`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecords(response.data.records);
            setFilteredRecords(response.data.records);
        } catch (error) {
            console.error('Failed to fetch records:', error);
            showSnackbar('Failed to fetch records', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        let filtered = records;

        if (searchTerm) {
            filtered = filtered.filter(record =>
                record.animal?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.bull?.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.inseminator?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterOutcome !== 'all') {
            filtered = filtered.filter(record => record.outcome === filterOutcome);
        }

        if (filterSpecies !== 'all') {
            filtered = filtered.filter(record => record.animal?.species === filterSpecies);
        }

        setFilteredRecords(filtered);
    }, [searchTerm, filterOutcome, filterSpecies, records]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleMenuClick = (event, record) => {
        setAnchorEl(event.currentTarget);
        setSelectedRecord(record);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewDetails = () => {
        setDetailsDialogOpen(true);
        handleMenuClose();
    };

    const handleOpenEdit = () => {
        setEditFormData({
            insemination_date: selectedRecord.insemination_date?.split('T')[0] || '',
            inseminator: selectedRecord.inseminator || '',
            bull_breed: selectedRecord.bull?.breed || '',
            outcome: selectedRecord.outcome || '',
            notes: selectedRecord.notes || '',
        });
        setEditDialogOpen(true);
        handleMenuClose();
    };

    const handleOpenDelete = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleEditSubmit = async () => {
        if (!API_BASE_URL) {
            showSnackbar('API configuration error', 'error');
            return;
        }
        setEditLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/insemination/${selectedRecord.id}`, editFormData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showSnackbar('Record updated successfully', 'success');
            setEditDialogOpen(false);
            fetchRecords();
        } catch (error) {
            console.error('Failed to update record:', error);
            showSnackbar('Failed to update record', 'error');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!API_BASE_URL) {
            showSnackbar('API configuration error', 'error');
            return;
        } setDeleteLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/insemination/${selectedRecord.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showSnackbar('Record deleted successfully', 'success');
            setDeleteDialogOpen(false);
            fetchRecords();
        } catch (error) {
            console.error('Failed to delete record:', error);
            showSnackbar(error.response?.data?.message || 'Failed to delete record', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const getOutcomeChip = (outcome) => {
        const config = {
            pregnant: {
                label: 'Pregnant',
                color: '#059669',
                bgColor: '#ecfdf5',
                icon: <CheckCircleIcon sx={{ fontSize: 16 }} />
            },
            not_pregnant: {
                label: 'Not Pregnant',
                color: '#dc2626',
                bgColor: '#fef2f2',
                icon: <CancelIcon sx={{ fontSize: 16 }} />
            },
            unknown: {
                label: 'Unknown',
                color: '#7c3aed',
                bgColor: '#f5f3ff',
                icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} />
            },
        };
        const { label, color, bgColor, icon } = config[outcome] || config.unknown;
        return (
            <Chip
                label={label}
                size="small"
                icon={icon}
                sx={{
                    bgcolor: bgColor,
                    color: color,
                    fontWeight: 600,
                    border: 'none'
                }}
            />
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null;
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const availableSpecies = [...new Set(records.map(r => r.animal?.species).filter(Boolean))];

    return (
        <Box sx={{ background: '#ffffff', minHeight: '100vh', p: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ color: '#000000', fontWeight: 700, mb: 0.5 }}>
                        INSEMINATION RECORDS
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#000000', fontWeight: 500 }}>
                        View and manage all insemination records
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#8b5cf6',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: '10px 20px',
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#7c3aed' }
                    }}
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/fmr.drb/inseminationcard')}
                >
                    Add Record
                </Button>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Card sx={{ mb: 3, bgcolor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search by animal, breed, or inseminator..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#8b5cf6' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    bgcolor: '#f9f9f9',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#8b5cf6' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#000000'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Filter by Outcome"
                                value={filterOutcome}
                                onChange={(e) => setFilterOutcome(e.target.value)}
                                sx={{
                                    bgcolor: '#f9f9f9',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#8b5cf6' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#000000'
                                    }
                                }}
                            >
                                <MenuItem value="all">All Outcomes</MenuItem>
                                <MenuItem value="pregnant">Pregnant</MenuItem>
                                <MenuItem value="not_pregnant">Not Pregnant</MenuItem>
                                <MenuItem value="unknown">Unknown</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Filter by Species"
                                value={filterSpecies}
                                onChange={(e) => setFilterSpecies(e.target.value)}
                                sx={{
                                    bgcolor: '#f9f9f9',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#8b5cf6' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#000000'
                                    }
                                }}
                            >
                                <MenuItem value="all">All Species</MenuItem>
                                {availableSpecies.map(species => (
                                    <MenuItem key={species} value={species}>
                                        {species.charAt(0).toUpperCase() + species.slice(1)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Typography variant="body2" color="#000000" fontWeight={600}>
                                Showing {filteredRecords.length} of {records.length} records
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress sx={{ color: '#8b5cf6' }} size={48} />
                </Box>
            ) : filteredRecords.length === 0 ? (
                <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                    <CardContent>
                        <Box textAlign="center" py={6}>
                            <PetsIcon sx={{ fontSize: 64, color: '#e5e7eb', mb: 2 }} />
                            <Typography variant="h6" color="#000000" gutterBottom fontWeight={600}>
                                No records found
                            </Typography>
                            <Typography variant="body2" color="#666666">
                                Try adjusting your filters or search terms
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        bgcolor: '#ffffff',
                        border: '1px solid #f0f0f0',
                        overflowX: 'auto'
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: '#f9f9f9', borderBottom: '2px solid #f0f0f0' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: '#000000', fontSize: '0.875rem' }}>Animal</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#000000', fontSize: '0.875rem' }}>Species</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#000000', fontSize: '0.875rem' }}>Insemination Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#000000', fontSize: '0.875rem' }}>Bull Breed</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#000000', fontSize: '0.875rem' }}>Outcome</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#000000', fontSize: '0.875rem' }}>Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#000000', fontSize: '0.875rem' }}>Inseminator</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#000000', fontSize: '0.875rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRecords.map((record) => {
                                const daysUntilDue = getDaysUntilDue(record.expected_due_date);
                                return (
                                    <TableRow
                                        key={record.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#f9f9f9' },
                                            '&:last-child td': { border: 0 },
                                            borderBottom: '1px solid #f0f0f0'
                                        }}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PetsIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600} color="#000000">
                                                        {record.animal?.name || 'Unknown'}
                                                    </Typography>
                                                    {record.animal?.tag && (
                                                        <Typography variant="caption" color="#666666">
                                                            Tag: {record.animal.tag}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={record.animal?.species || 'N/A'}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#dbeafe',
                                                    color: '#0369a1',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <CalendarIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
                                                <Typography variant="body2" color="#000000">
                                                    {formatDate(record.insemination_date)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="#000000" fontWeight={500}>
                                                {record.bull?.breed || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{getOutcomeChip(record.outcome)}</TableCell>
                                        <TableCell>
                                            {record.expected_due_date ? (
                                                <Box>
                                                    <Typography variant="body2" color="#000000">
                                                        {formatDate(record.expected_due_date)}
                                                    </Typography>
                                                    {daysUntilDue !== null && record.outcome === 'pregnant' && (
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: daysUntilDue < 30 ? '#dc2626' : '#059669',
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {daysUntilDue > 0
                                                                ? `${daysUntilDue} days left`
                                                                : `Overdue by ${Math.abs(daysUntilDue)} days`}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="#666666">
                                                    N/A
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="#000000">
                                                {record.inseminator || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="More actions">
                                                <IconButton
                                                    onClick={(e) => handleMenuClick(e, record)}
                                                    size="small"
                                                    sx={{
                                                        color: '#8b5cf6',
                                                        '&:hover': {
                                                            bgcolor: '#f3f0ff',
                                                            color: '#7c3aed'
                                                        }
                                                    }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        mt: 1
                    }
                }}
            >
                <MenuItem onClick={handleViewDetails} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <SearchIcon fontSize="small" sx={{ color: '#8b5cf6' }} />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleOpenEdit} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" sx={{ color: '#0369a1' }} />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleOpenDelete} sx={{ py: 1.5, color: '#dc2626' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: '#dc2626' }} />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '12px' }
                }}
            >
                <DialogTitle sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #f0f0f0', pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#000000">
                        Insemination Record Details
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 3, bgcolor: '#ffffff' }}>
                    {selectedRecord && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                    Animal
                                </Typography>
                                <Typography variant="body1" fontWeight={600} color="#000000">
                                    {selectedRecord.animal?.name || 'Unknown'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                    Species
                                </Typography>
                                <Typography variant="body1" color="#000000">
                                    {selectedRecord.animal?.species || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                    Status
                                </Typography>
                                <Typography variant="body1" color="#000000">
                                    {selectedRecord.animal?.status || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                    Insemination Date
                                </Typography>
                                <Typography variant="body1" color="#000000">
                                    {formatDate(selectedRecord.insemination_date)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                    Expected Due Date
                                </Typography>
                                <Typography variant="body1" color="#000000">
                                    {formatDate(selectedRecord.expected_due_date)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                    Inseminator
                                </Typography>
                                <Typography variant="body1" color="#000000">
                                    {selectedRecord.inseminator || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                    Outcome
                                </Typography>
                                <Box mt={0.5}>
                                    {getOutcomeChip(selectedRecord.outcome)}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                    Bull Information
                                </Typography>
                                <Typography variant="body1" color="#000000">
                                    Breed: {selectedRecord.bull?.breed || 'N/A'}
                                </Typography>
                                {selectedRecord.bull?.name && (
                                    <Typography variant="body1" color="#000000">
                                        Name: {selectedRecord.bull.name}
                                    </Typography>
                                )}
                            </Grid>
                            {selectedRecord.notes && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="#666666" gutterBottom fontWeight={600}>
                                        Notes
                                    </Typography>
                                    <Typography variant="body2" color="#000000">
                                        {selectedRecord.notes}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: '#f9f9f9', borderTop: '1px solid #f0f0f0' }}>
                    <Button
                        onClick={() => setDetailsDialogOpen(false)}
                        sx={{
                            color: '#8b5cf6',
                            '&:hover': { bgcolor: '#f3f0ff' }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '12px' }
                }}
            >
                <DialogTitle sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #f0f0f0', pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#000000">
                        Edit Insemination Record
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 3, bgcolor: '#ffffff' }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Insemination Date"
                                value={editFormData.insemination_date}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, insemination_date: e.target.value })
                                }
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#8b5cf6' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#000000'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Inseminator"
                                value={editFormData.inseminator}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, inseminator: e.target.value })
                                }
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#8b5cf6' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#000000'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bull Breed"
                                value={editFormData.bull_breed}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, bull_breed: e.target.value })
                                }
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#8b5cf6' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#000000'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Outcome"
                                value={editFormData.outcome}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, outcome: e.target.value })
                                }
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#8b5cf6' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#000000'
                                    }
                                }}
                            >
                                <MenuItem value="pregnant">Pregnant</MenuItem>
                                <MenuItem value="not_pregnant">Not Pregnant</MenuItem>
                                <MenuItem value="unknown">Unknown</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Notes"
                                value={editFormData.notes}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, notes: e.target.value })
                                }
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#8b5cf6' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#000000'
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: '#f9f9f9', borderTop: '1px solid #f0f0f0' }}>
                    <Button
                        onClick={() => setEditDialogOpen(false)}
                        sx={{
                            color: '#8b5cf6',
                            '&:hover': { bgcolor: '#f3f0ff' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSubmit}
                        variant="contained"
                        disabled={editLoading}
                        sx={{
                            bgcolor: '#8b5cf6',
                            '&:hover': { bgcolor: '#7c3aed' },
                            color: '#ffffff'
                        }}
                        startIcon={editLoading && <CircularProgress size={16} sx={{ color: '#ffffff' }} />}
                    >
                        {editLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '12px' }
                }}
            >
                <DialogTitle sx={{ bgcolor: '#fef2f2', borderBottom: '1px solid #fecaca', pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#dc2626">
                        Delete Record?
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 3, bgcolor: '#ffffff' }}>
                    <Typography variant="body1" color="#000000">
                        Are you sure you want to delete this insemination record for{' '}
                        <strong>{selectedRecord?.animal?.name}</strong>?
                    </Typography>
                    {selectedRecord?.has_calved && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            This record cannot be deleted as the animal has already calved.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: '#f9f9f9', borderTop: '1px solid #f0f0f0' }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            color: '#8b5cf6',
                            '&:hover': { bgcolor: '#f3f0ff' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        disabled={deleteLoading || selectedRecord?.has_calved}
                        sx={{
                            bgcolor: '#dc2626',
                            '&:hover': { bgcolor: '#991b1b' },
                            color: '#ffffff',
                            '&.Mui-disabled': {
                                bgcolor: '#fca5a5',
                                color: '#ffffff'
                            }
                        }}
                        startIcon={deleteLoading && <CircularProgress size={16} sx={{ color: '#ffffff' }} />}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InseminationRecordsList;