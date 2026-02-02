import React from 'react';
import { getRoleColor, getRoleBgColor } from '../utils/formatters';

const ViewsChart = ({ byRole, totalViews }) => {
  if (!totalViews || Object.keys(byRole).length === 0) {
    return (
      <div className="text-center p-4" style={{ color: '#64748b' }}>
        No view data available yet
      </div>
    );
  }

  const roles = Object.entries(byRole).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-4">
      <h6 className="mb-4 fw-bold" style={{ color: '#0f172a' }}>
        Views by User Type
      </h6>
      
      {roles.map(([role, count]) => {
        const percentage = (count / totalViews) * 100;
        const color = getRoleColor(role);
        const bgColor = getRoleBgColor(role);
        
        return (
          <div key={role} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <span 
                  className="badge"
                  style={{ 
                    backgroundColor: bgColor,
                    color: color,
                    textTransform: 'capitalize',
                    fontWeight: 600
                  }}
                >
                  {role}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {count} views
                </span>
              </div>
              <span className="fw-bold" style={{ color: '#0f172a' }}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div 
              className="position-relative rounded"
              style={{ 
                height: '8px', 
                backgroundColor: '#f1f5f9',
                overflow: 'hidden'
              }}
            >
              <div 
                className="position-absolute h-100 rounded"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: color,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewsChart;