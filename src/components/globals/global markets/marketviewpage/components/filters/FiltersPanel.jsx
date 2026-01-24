// marketviewpage/components/filters/FiltersPanel.jsx
import React from "react";
import {
  Box,
  Card,
  TextField,
  MenuItem,
  Button,
  Typography,
  Collapse,
  Grid,
} from "@mui/material";
import { X } from "lucide-react";

export default function FiltersPanel({ open, filters, onChange, onClear }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <Collapse in={open}>
      <Card
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#000" }}>
            Filter Options
          </Typography>
          <Button
            onClick={onClear}
            startIcon={<X size={16} />}
            sx={{ color: "#6b7280", textTransform: "none" }}
          >
            Clear All
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Species"
              value={filters.species}
              onChange={(e) => handleChange("species", e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: "#000" },
                "& .MuiInputBase-input": { color: "#000" },
              }}
            >
              <MenuItem value="">All Species</MenuItem>
              <MenuItem value="cow">🐄 Cow</MenuItem>
              <MenuItem value="goat">🐐 Goat</MenuItem>
              <MenuItem value="sheep">🐑 Sheep</MenuItem>
              <MenuItem value="pig">🐖 Pig</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Gender"
              value={filters.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: "#000" },
                "& .MuiInputBase-input": { color: "#000" },
              }}
            >
              <MenuItem value="">All Genders</MenuItem>
              <MenuItem value="female">♀ Female</MenuItem>
              <MenuItem value="male">♂ Male</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Stage"
              value={filters.stage}
              onChange={(e) => handleChange("stage", e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: "#000" },
                "& .MuiInputBase-input": { color: "#000" },
              }}
            >
              <MenuItem value="">All Stages</MenuItem>
              <MenuItem value="calf">Calf</MenuItem>
              <MenuItem value="weaner">Weaner</MenuItem>
              <MenuItem value="mature">Mature</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Pregnant"
              value={filters.pregnant}
              onChange={(e) => handleChange("pregnant", e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: "#000" },
                "& .MuiInputBase-input": { color: "#000" },
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Min Price (KES)"
              value={filters.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: "#000" },
                "& .MuiInputBase-input": { color: "#000" },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Max Price (KES)"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: "#000" },
                "& .MuiInputBase-input": { color: "#000" },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={filters.sort}
              onChange={(e) => handleChange("sort", e.target.value)}
              sx={{
                "& .MuiInputLabel-root": { color: "#000" },
                "& .MuiInputBase-input": { color: "#000" },
              }}
            >
              <MenuItem value="createdAt">Newest First</MenuItem>
              <MenuItem value="price_asc">Price: Low → High</MenuItem>
              <MenuItem value="price_desc">Price: High → Low</MenuItem>
              <MenuItem value="views_desc">Most Viewed</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>
    </Collapse>
  );
}