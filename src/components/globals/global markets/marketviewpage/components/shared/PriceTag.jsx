// marketviewpage/components/shared/PriceTag.jsx
import React from "react";
import { Typography } from "@mui/material";
import { formatCurrency } from "../../utils/currency.utils";

export default function PriceTag({ value }) {
  return (
    <Typography variant="h5" fontWeight="bold" color="success.main">
      {formatCurrency(value)}
    </Typography>
  );
}