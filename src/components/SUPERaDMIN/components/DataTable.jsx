
// ============================================
// FILE: /src/superadmin/components/DataTable.jsx
// ============================================
import React from 'react';

const DataTable = ({ columns, data, onRowClick, actions }) => (
  <div className="card" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead style={{ backgroundColor: '#fafafa' }}>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="border-0 small" style={{ color: '#64748b', fontWeight: 600 }}>{col.label}</th>
            ))}
            {actions && <th className="border-0 small" style={{ color: '#64748b', fontWeight: 600 }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4" style={{ color: '#64748b' }}>No data available</td></tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} onClick={() => onRowClick && onRowClick(row)} 
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="align-middle" style={{ color: '#0f172a' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && <td className="align-middle"><div className="d-flex gap-2">{actions(row)}</div></td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
