import React, { useState, useEffect, useContext } from 'react';
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
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import Header from '../../scenes/Header';

const InseminationRecordsList = () => {
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

    const API_BASE_URL =     process.env.REACT_APP_API_BASE
    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_BASE_URL, {
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
        setEditLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/${selectedRecord.id}`, editFormData, {
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
        setDeleteLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/${selectedRecord.id}`, {
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
                color: '#10b981',
                bgColor: '#d1fae5',
                icon: <CheckCircleIcon sx={{ fontSize: 16 }} />
            },
            not_pregnant: {
                label: 'Not Pregnant',
                color: '#ef4444',
                bgColor: '#fee2e2',
                icon: <CancelIcon sx={{ fontSize: 16 }} />
            },
            unknown: {
                label: 'Unknown',
                color: '#64748b',
                bgColor: '#f1f5f9',
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
        <Box m="20px">
            <Header
                title="INSEMINATION RECORDS"
                subtitle="View and manage all insemination records"
            />

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

            <Card sx={{ mb: 3, bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
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
                                            <SearchIcon sx={{ color: '#10b981' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    bgcolor: '#fafafa',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#10b981' },
                                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
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
                                    bgcolor: '#fafafa',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#10b981' },
                                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
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
                                    bgcolor: '#fafafa',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#10b981' },
                                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
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
                            <Typography variant="body2" color="#64748b" fontWeight={500}>
                                Showing {filteredRecords.length} of {records.length} records
                            </Typography>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress sx={{ color: '#10b981' }} size={48} />
                </Box>
            ) : filteredRecords.length === 0 ? (
                <Card sx={{ bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <CardContent>
                        <Box textAlign="center" py={6}>
                            <PetsIcon sx={{ fontSize: 64, color: '#d1fae5', mb: 2 }} />
                            <Typography variant="h6" color="#0f172a" gutterBottom fontWeight={600}>
                                No records found
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                Try adjusting your filters or search terms
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        bgcolor: '#ffffff'
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Animal</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Species</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Insemination Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Bull Breed</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Outcome</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Inseminator</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRecords.map((record) => {
                                const daysUntilDue = getDaysUntilDue(record.expected_due_date);
                                return (
                                    <TableRow
                                        key={record.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#fafafa' },
                                            '&:last-child td': { border: 0 }
                                        }}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PetsIcon sx={{ color: '#10b981', fontSize: 20 }} />
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600} color="#0f172a">
                                                        {record.animal?.name || 'Unknown'}
                                                    </Typography>
                                                    {record.animal?.tag && (
                                                        <Typography variant="caption" color="#64748b">
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
                                                    color: '#3b82f6',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <CalendarIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                                <Typography variant="body2" color="#0f172a">
                                                    {formatDate(record.insemination_date)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="#0f172a" fontWeight={500}>
                                                {record.bull?.breed || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{getOutcomeChip(record.outcome)}</TableCell>
                                        <TableCell>
                                            {record.expected_due_date ? (
                                                <Box>
                                                    <Typography variant="body2" color="#0f172a">
                                                        {formatDate(record.expected_due_date)}
                                                    </Typography>
                                                    {daysUntilDue !== null && record.outcome === 'pregnant' && (
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: daysUntilDue < 30 ? '#ef4444' : '#10b981',
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
                                                <Typography variant="body2" color="#64748b">
                                                    N/A
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="#0f172a">
                                                {record.inseminator || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="More actions">
                                                <IconButton
                                                    onClick={(e) => handleMenuClick(e, record)}
                                                    size="small"
                                                    sx={{
                                                        color: '#64748b',
                                                        '&:hover': {
                                                            bgcolor: '#f1f5f9',
                                                            color: '#10b981'
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
                        borderRadius: '12px',
                        mt: 1
                    }
                }}
            >
                <MenuItem onClick={handleViewDetails} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <SearchIcon fontSize="small" sx={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleOpenEdit} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" sx={{ color: '#3b82f6' }} />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleOpenDelete} sx={{ py: 1.5, color: '#ef4444' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
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
                    sx: { borderRadius: '16px' }
                }}
            >
                <DialogTitle sx={{ bgcolor: '#fafafa', borderBottom: '1px solid #e5e7eb', pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#0f172a">
                        Insemination Record Details
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 3, bgcolor: '#ffffff' }}>
                    {selectedRecord && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                    Animal
                                </Typography>
                                <Typography variant="body1" fontWeight={600} color="#0f172a">
                                    {selectedRecord.animal?.name || 'Unknown'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                    Species
                                </Typography>
                                <Typography variant="body1" color="#0f172a">
                                    {selectedRecord.animal?.species || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                    Status
                                </Typography>
                                <Typography variant="body1" color="#0f172a">
                                    {selectedRecord.animal?.status || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                    Insemination Date
                                </Typography>
                                <Typography variant="body1" color="#0f172a">
                                    {formatDate(selectedRecord.insemination_date)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                    Expected Due Date
                                </Typography>
                                <Typography variant="body1" color="#0f172a">
                                    {formatDate(selectedRecord.expected_due_date)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                    Inseminator
                                </Typography>
                                <Typography variant="body1" color="#0f172a">
                                    {selectedRecord.inseminator || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                    Outcome
                                </Typography>
                                <Box mt={0.5}>
                                    {getOutcomeChip(selectedRecord.outcome)}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                    Bull Information
                                </Typography>
                                <Typography variant="body1" color="#0f172a">
                                    Breed: {selectedRecord.bull?.breed || 'N/A'}
                                </Typography>
                                {selectedRecord.bull?.name && (
                                    <Typography variant="body1" color="#0f172a">
                                        Name: {selectedRecord.bull.name}
                                    </Typography>
                                )}
                            </Grid>
                            {selectedRecord.notes && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="#64748b" gutterBottom fontWeight={600}>
                                        Notes
                                    </Typography>
                                    <Typography variant="body2" color="#0f172a">
                                        {selectedRecord.notes}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
                    <Button
                        onClick={() => setDetailsDialogOpen(false)}
                        sx={{
                            color: '#64748b',
                            '&:hover': { bgcolor: '#f1f5f9' }
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
                    sx: { borderRadius: '16px' }
                }}
            >
                <DialogTitle sx={{ bgcolor: '#fafafa', borderBottom: '1px solid #e5e7eb', pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#0f172a">
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
                                        '&:hover fieldset': { borderColor: '#10b981' },
                                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
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
                                        '&:hover fieldset': { borderColor: '#10b981' },
                                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
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
                                        '&:hover fieldset': { borderColor: '#10b981' },
                                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
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
                                        '&:hover fieldset': { borderColor: '#10b981' },
                                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
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
                                        '&:hover fieldset': { borderColor: '#10b981' },
                                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
                    <Button
                        onClick={() => setEditDialogOpen(false)}
                        sx={{
                            color: '#64748b',
                            '&:hover': { bgcolor: '#f1f5f9' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSubmit}
                        variant="contained"
                        disabled={editLoading}
                        sx={{
                            bgcolor: '#10b981',
                            '&:hover': { bgcolor: '#059669' },
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
                    sx: { borderRadius: '16px' }
                }}
            >
                <DialogTitle sx={{ bgcolor: '#fef2f2', borderBottom: '1px solid #fecaca', pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#ef4444">
                        Delete Record?
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 3, bgcolor: '#ffffff' }}>
                    <Typography variant="body1" color="#0f172a">
                        Are you sure you want to delete this insemination record for{' '}
                        <strong>{selectedRecord?.animal?.name}</strong>?
                    </Typography>
                    {selectedRecord?.has_calved && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            This record cannot be deleted as the animal has already calved.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            color: '#64748b',
                            '&:hover': { bgcolor: '#f1f5f9' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        disabled={deleteLoading || selectedRecord?.has_calved}
                        sx={{
                            bgcolor: '#ef4444',
                            '&:hover': { bgcolor: '#dc2626' },
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