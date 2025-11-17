import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Box, Typography, useTheme, IconButton, TextField, InputAdornment, useMediaQuery
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import UpdateFarmer from "../myfarmers/UpdateFarmer";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Users, Pencil, Trash2, RefreshCcw, Search } from "lucide-react";

const ViewFarmers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [farmers, setFarmers] = useState([]);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0); // zero-based for DataGrid
  const [pageSize, setPageSize] = useState(10);

   const Base_API = process.env.REACT_APP_API_BASE


  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  }

  // Fetch farmers
  const fetchFarmers = useCallback(
    async (pageNumber, size, search) => {
      setLoading(true);
      try {
        console.log('Fetching farmers:', { pageNumber: pageNumber + 1, size, search }); // Debug log
        
        const { data } = await axios.get(
          `${Base_API}/farmers?page=${pageNumber + 1}&limit=${size}&search=${encodeURIComponent(search)}`,
          authHeader
        );

        console.log('API Response:', data); // Debug log

        setFarmers(data.farmers || []);
        setTotalFarmers(data.total || 0);
        setError("");
      } catch (err) {
        console.error('Fetch error:', err);
        setError("Failed to fetch farmers.");
        // Don't reset farmers on error to maintain state
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchFarmers(page, pageSize, searchTerm);
  }, [page, pageSize, searchTerm, fetchFarmers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page
  };

  // Fixed page change handler
  const handlePageChange = (newPage) => {
    console.log('Page change requested:', { currentPage: page, newPage, totalFarmers, pageSize }); // Debug log
    setPage(newPage);
  };

  const handleDelete = async (farmerCode, farmerName) => {
    const confirmToastId = toast.info(
      <div style={{ color: colors.primary[100] }}>
        <div>
          Are you sure you want to delete <strong>{farmerName}</strong>?
        </div>
        <div className="mt-2 d-flex justify-content-end gap-2">
          <button
            style={{ backgroundColor: colors.redAccent[500], color: "#fff" }}
            className="btn btn-sm"
            onClick={async () => {
              toast.dismiss(confirmToastId);
              try {
                await axios.delete(
                  `https://maziwasmart.onrender.com/api/farmers/${farmerCode}`,
                  authHeader
                );
                fetchFarmers(page, pageSize, searchTerm);
                toast.success("Farmer deleted successfully");
              } catch {
                toast.error("Delete failed");
              }
            }}
          >
            Yes, Delete
          </button>
          <button
            style={{ backgroundColor: colors.grey[500], color: "#fff" }}
            className="btn btn-sm"
            onClick={() => toast.dismiss(confirmToastId)}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  const handleUpdateSuccess = () => {
    fetchFarmers(page, pageSize, searchTerm);
    setEditingFarmer(null);
  };

  const columns = [
    { field: "id", headerName: "#", width: 60, minWidth: 50 },
    { field: "fullname", headerName: "Full Name", flex: 1, minWidth: 120 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 100 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 150 },
    { field: "farmer_code", headerName: "Code", flex: 1, minWidth: 100 },
    { field: "location", headerName: "Location", flex: 1, minWidth: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="warning"
            size={isSmallScreen ? "small" : "medium"}
            onClick={() => setEditingFarmer(params.row)}
          >
            <Pencil size={isSmallScreen ? 14 : 16} />
          </IconButton>
          <IconButton
            color="error"
            size={isSmallScreen ? "small" : "medium"}
            onClick={() =>
              handleDelete(params.row.farmer_code, params.row.fullname)
            }
          >
            <Trash2 size={isSmallScreen ? 14 : 16} />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = farmers.map((f, idx) => ({
    id: page * pageSize + idx + 1,
    ...f,
  }));

  return (
    <Box m={isSmallScreen ? 1 : 4} display="flex" flexDirection="column" height="100%">
      <ToastContainer position="top-right" autoClose={3000} transition={Slide} theme="colored" />

      {editingFarmer && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ backgroundColor: colors.primary[400], color: "#fff" }}>
              <div className="modal-header" style={{ backgroundColor: colors.greenAccent[500], color: "#000" }}>
                <Typography variant="h6" component="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Pencil size={16} /> Edit Farmer Info
                </Typography>
                <button type="button" className="btn-close" onClick={() => setEditingFarmer(null)} />
              </div>
              <div className="modal-body">
                <UpdateFarmer
                  farmerData={editingFarmer}
                  onCancel={() => setEditingFarmer(null)}
                  onUpdateSuccess={handleUpdateSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"} justifyContent="space-between" alignItems={isSmallScreen ? "stretch" : "center"} mb={2}>
        <Typography variant={isSmallScreen ? "h5" : "h4"} color={colors.greenAccent[500]} display="flex" alignItems="center" gap={1}>
          <Users size={24} /> Farmers ({totalFarmers} total)
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent={isSmallScreen ? "stretch" : "flex-end"}>
          <Link to="/admindashboard/create-farmer">
            <button className="btn btn-primary fw-semibold">+ Add Farmer</button>
          </Link>
          <button onClick={() => fetchFarmers(page, pageSize, searchTerm)} className="btn btn-outline-info">
            <RefreshCcw size={18} style={{ marginRight: 6 }} /> Refresh
          </button>
        </Box>
      </Box>

      {/* Search */}
      <Box mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: "#c8f7c5", borderRadius: "8px" }}
        />
      </Box>

      {/* Debug info and manual controls (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Box mb={2} p={1} bgcolor="rgba(255,255,255,0.1)" borderRadius={1}>
          <Typography variant="caption" display="block" mb={1}>
            Debug: Page {page + 1} of {Math.ceil(totalFarmers / pageSize)}, Size {pageSize}, Total {totalFarmers}, Showing {farmers.length} farmers
          </Typography>
          <Box display="flex" gap={1}>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage(0)}
              disabled={page === 0 || loading}
            >
              First
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage(page - 1)}
              disabled={page === 0 || loading}
            >
              Previous
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(totalFarmers / pageSize) - 1 || loading}
            >
              Next
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage(Math.ceil(totalFarmers / pageSize) - 1)}
              disabled={page >= Math.ceil(totalFarmers / pageSize) - 1 || loading}
            >
              Last
            </button>
          </Box>
        </Box>
      )}

      {/* Table */}
      <DataGrid
        rows={rows}
        columns={columns}
        page={page}
        pageSize={pageSize}
        pagination={true}
        paginationMode="server"
        rowCount={totalFarmers}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        disableSelectionOnClick
        loading={loading}
        autoHeight={isSmallScreen}
        density={isSmallScreen ? "compact" : "standard"}
        checkboxSelection={false}
        disableColumnMenu={true}
        // Force pagination controls to show
        hideFooter={false}
        hideFooterPagination={false}
        // Set minimum height to ensure pagination controls are visible
        sx={{
          minHeight: 400,
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${colors.grey[300]}`,
            backgroundColor: colors.primary[400],
          }
        }}
      />
      
      {error && (
        <Box mt={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ViewFarmers;