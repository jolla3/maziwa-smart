// ============================================
// FILE: /src/superadmin/components/OnlineUserList.jsx
// ============================================
import React from 'react';
import { Users } from 'lucide-react';

const OnlineUserList = ({ users = [] }) => (
  <div className="card" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
    <div className="card-body">
      <h6 className="card-title mb-3" style={{ color: '#0f172a', fontWeight: 600 }}>
        <Users size={18} className="me-2" style={{ color: '#3b82f6' }} />Online Users ({users.length})
      </h6>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {users.length === 0 ? (
          <div className="text-center py-3" style={{ color: '#64748b' }}>No users online</div>
        ) : (
          users.map((u, i) => (
            <div key={i} className="d-flex align-items-center gap-2 p-2 rounded mb-2" style={{ backgroundColor: '#fafafa' }}>
              <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#10b981' }} />
              <span className="small" style={{ color: '#0f172a' }}>{u}</span>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default OnlineUserList;

