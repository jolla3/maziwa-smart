// marketviewpage/components/filters/MarketFiltersPanel.jsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Collapse,
} from "@mui/material";
import { X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const filterOptions = {
  species: [
    { value: "", label: "All Species" },
    { value: "cow", label: "🐄 Cow" },
    { value: "goat", label: "🐐 Goat" },
    { value: "sheep", label: "🐑 Sheep" },
    { value: "pig", label: "🐖 Pig" },
  ],
  gender: [
    { value: "", label: "All Genders" },
    { value: "female", label: "♀ Female" },
    { value: "male", label: "♂ Male" },
  ],
  stage: [
    { value: "", label: "All Stages" },
    { value: "calf", label: "Calf" },
    { value: "weaner", label: "Weaner" },
    { value: "mature", label: "Mature" },
  ],
  pregnant: [
    { value: "", label: "All" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ],
  sort: [
    { value: "createdAt", label: "Newest First" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "views_desc", label: "Most Viewed" },
  ],
};

export default function MarketFiltersPanel({
  show,
  filters,
  onFilterChange,
  onClearFilters,
  onClose,
}) {
  return (
    <AnimatePresence>
      {show && (
        <Collapse in={show}>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                mb: 3,
                boxShadow: 1,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Filter size={20} color="#667eea" style={{ marginRight: 8 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Filter Your Search
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={onClose}>
                    <X size={18} />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    select
                    fullWidth
                    label="Species"
                    value={filters.species}
                    onChange={(e) => onFilterChange("species", e.target.value)}
                    size="small"
                  >
                    {filterOptions.species.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Gender"
                    value={filters.gender}
                    onChange={(e) => onFilterChange("gender", e.target.value)}
                    size="small"
                  >
                    {filterOptions.gender.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Stage"
                    value={filters.stage}
                    onChange={(e) => onFilterChange("stage", e.target.value)}
                    size="small"
                  >
                    {filterOptions.stage.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Pregnant"
                    value={filters.pregnant}
                    onChange={(e) => onFilterChange("pregnant", e.target.value)}
                    size="small"
                  >
                    {filterOptions.pregnant.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    type="number"
                    label="Min Price (KES)"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => onFilterChange("minPrice", e.target.value)}
                    size="small"
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="Max Price (KES)"
                    placeholder="100000"
                    value={filters.maxPrice}
                    onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                    size="small"
                  />

                  <TextField
                    select
                    fullWidth
                    label="Sort By"
                    value={filters.sort}
                    onChange={(e) => onFilterChange("sort", e.target.value)}
                    size="small"
                    sx={{ gridColumn: { md: "span 2" } }}
                  >
                    {filterOptions.sort.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    variant="outlined"
                    onClick={onClearFilters}
                    sx={{
                      gridColumn: { xs: "1", md: "span 2" },
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Collapse>
      )}
    </AnimatePresence>
  );
}