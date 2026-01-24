// marketviewpage/components/search/SearchBar.jsx
import React from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import { Search, Filter } from "lucide-react";

export default function SearchBar({ value, onChange, onFilterClick }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <TextField
        fullWidth
        placeholder="Search livestock, breeds, location..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} color="#6b7280" />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: "#ffffff",
            "& input": { color: "#000" },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#e5e7eb" },
            "&:hover fieldset": { borderColor: "#d1d5db" },
            "&.Mui-focused fieldset": { borderColor: "#667eea" },
          },
        }}
      />
      <Button
        variant="outlined"
        startIcon={<Filter size={18} />}
        onClick={onFilterClick}
        sx={{
          minWidth: 120,
          color: "#000",
          borderColor: "#e5e7eb",
          "&:hover": {
            borderColor: "#667eea",
            backgroundColor: "#667eea15",
          },
          textTransform: "none",
        }}
      >
        Filters
      </Button>
    </Box>
  );
}