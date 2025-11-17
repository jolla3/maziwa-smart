// src/components/admin/downloads/DownloadMonthlyReport.jsx
import React, { useContext, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { AuthContext } from "../PrivateComponents/AuthContext";

const DownloadMonthlyReport = () => {
  const [month, setMonth] = useState("");
   const Base_API = process.env.REACT_APP_API_BASE
   const { token } = useContext(AuthContext);


  const handleDownload = async () => {
    try {
      const url = month
        ? `${Base_API}/summary/farmerSummary?month=${month}`
        : `${Base_API}/summary/farmerSummary`;

      // const token = localStorage.getItem("token");

      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `milk_report_${month || "current_month"}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ mt: { xs: 2, md: 0 } }}>
      <TextField
        type="month"
        size="small"
        label="Select Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
        startIcon={<DownloadOutlinedIcon />}
      >
        Download Monthly Report
      </Button>
    </Box>
  );
};

export default DownloadMonthlyReport;
