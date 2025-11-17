import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  TextField,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import UpdatePorter from "./UpdatePorter";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Users, Pencil, Trash2, RefreshCcw, Search } from "lucide-react";


const ViewPorters = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [porters, setPorters] = useState([]);
  const [totalPorters, setTotalPorters] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPorter, setEditingPorter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0); // zero-based page index for DataGrid
  const [pageSize, setPageSize] = useState(10);

   const Base_API = process.env.REACT_APP_API_BASE


  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // fetchPorters now takes explicit parameters
  const fetchPorters = useCallback(
    async (pageNumber, size, search) => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${Base_API}/porters?page=${pageNumber + 1}&limit=${size}&search=${encodeURIComponent(search)}`,
          authHeader
        );

        const portersList = data.porters || [];
        const totalCount = data.totalCount || 0;

        setTotalPorters(totalCount);

        // If page is beyond last page, go back one page
        if (portersList.length === 0 && pageNumber > 0) {
          setPage(pageNumber - 1);
          return;
        }

        setPorters(portersList);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch porters.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // useEffect calls fetchPorters explicitly with current states
  useEffect(() => {
    fetchPorters(page, pageSize, searchTerm);
  }, [page, pageSize, searchTerm, fetchPorters]);

  // On search, reset page to 0 and update searchTerm, fetching happens automatically due to useEffect
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleDelete = async (porterId, porterName) => {
    const confirmToastId = toast.info(
      <div style={{ color: colors.primary[100] }}>
        <div>
          Are you sure you want to delete <strong>{porterName}</strong>?
        </div>
        <div className="mt-2 d-flex justify-content-end gap-2">
          <button
            style={{ backgroundColor: colors.redAccent[500], color: "#fff" }}
            className="btn btn-sm"
            onClick={async () => {
              toast.dismiss(confirmToastId);
              try {
                await axios.delete(
                  `${Base_API}/porters/${porterId}`,
                  authHeader
                );
                fetchPorters(page, pageSize, searchTerm); // refresh current page
                toast.success("Porter deleted successfully");
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
    fetchPorters(page, pageSize, searchTerm);
    setEditingPorter(null);
  };

  const columns = [
    { field: "id", headerName: "#", width: 60, minWidth: 50 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 100 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 100 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 150 },
    { field: "assigned_route", headerName: "Route", flex: 1, minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="warning"
            onClick={() => setEditingPorter(params.row)}
            size={isSmallScreen ? "small" : "medium"}
          >
            <Pencil size={isSmallScreen ? 14 : 16} />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id, params.row.name)}
            size={isSmallScreen ? "small" : "medium"}
          >
            <Trash2 size={isSmallScreen ? 14 : 16} />
          </IconButton>
        </>
      ),
    },
  ];

  // Add id for DataGrid rows (required)
  const rows = porters.map((p, idx) => ({
    id: page * pageSize + idx + 1,
    ...p,
  }));

  return (
    <Box
      m={isSmallScreen ? 1 : 4}
      display="flex"
      flexDirection="column"
      maxWidth="100%"
      height="100%"
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
        theme="colored"
      />

      {editingPorter && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div
              className="modal-content"
              style={{ backgroundColor: colors.primary[400], color: "#fff" }}
            >
              <div
                className="modal-header"
                style={{
                  backgroundColor: colors.greenAccent[500],
                  color: "#000",
                }}
              >
                <Typography
                  variant="h6"
                  component="h5"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Pencil size={16} /> Edit Porter Info
                </Typography>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingPorter(null)}
                />
              </div>
              <div className="modal-body">
                <UpdatePorter
                  porterData={editingPorter}
                  onCancel={() => setEditingPorter(null)}
                  onUpdateSuccess={handleUpdateSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isSmallScreen ? "stretch" : "center"}
        mb={2}
        gap={isSmallScreen ? 2 : 0}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          color={colors.greenAccent[500]}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Users size={24} /> Porters
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          justifyContent={isSmallScreen ? "stretch" : "flex-end"}
          width={isSmallScreen ? "100%" : "auto"}
        >
          <Link
            to="/admindashboard/create-porter"
            style={{ flexGrow: isSmallScreen ? 1 : 0 }}
          >
            <button
              className="btn btn-primary fw-semibold"
              style={{ width: isSmallScreen ? "100%" : "auto" }}
            >
              + Add Porter
            </button>
          </Link>
          <button
            onClick={() => fetchPorters(page, pageSize, searchTerm)}
            className="btn btn-outline-info"
            style={{ width: isSmallScreen ? "100%" : "auto" }}
          >
            <RefreshCcw size={18} style={{ marginRight: 6 }} /> Refresh
          </button>
        </Box>
      </Box>

      <Box
        mb={2}
        display="flex"
        alignItems="center"
        gap={1}
        flexDirection={isSmallScreen ? "column" : "row"}
      >
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
          sx={{
            backgroundColor: "#c8f7c5",
            borderRadius: "8px",
          }}
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: isSmallScreen ? 300 : 500,
          height: isSmallScreen ? "auto" : "70vh",
          width: "100%",
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        {loading ? (
          <Typography>Loading porters...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            page={page}
            pageSize={pageSize}
            pagination
            paginationMode="server"
            rowCount={totalPorters}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            autoHeight={isSmallScreen}
            density={isSmallScreen ? "compact" : "standard"}
          />
        )}
      </Box>
    </Box>
  );
};

export default ViewPorters;
