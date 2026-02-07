// ============================================
// FILE: /src/superadmin/components/SparklineChart.jsx
// ============================================
import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';  // <-- ADD: More components for better display

const SparklineChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data.map((value, index) => ({ time: index + 1, value })) : [
    { time: 1, value: 10 }, { time: 2, value: 15 }, { time: 3, value: 12 }, { time: 4, value: 18 }, { time: 5, value: 20 }
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>  {/* <-- INCREASED HEIGHT FOR BETTER DISPLAY */}
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />  {/* <-- THICKER LINE AND DOTS */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparklineChart;