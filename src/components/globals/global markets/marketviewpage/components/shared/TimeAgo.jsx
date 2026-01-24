// marketviewpage/components/shared/TimeAgo.jsx
import React from "react";
import { timeAgo } from "../../utils/currency.utils";

export default function TimeAgo({ date }) {
  return <>{timeAgo(date)}</>;
}