// ============================================
// FILE: /src/superadmin/components/OnlineUserList.jsx
// ============================================
import React from 'react';
import { Users, MapPin } from 'lucide-react';

const OnlineUserList = ({ users = [] }) => (
  <div className="card border-0 shadow-lg">
    <div className="card-body">
      <h6 className="card-title mb-3" style={{ color: '#0f172a', fontWeight: 600 }}>
        <Users size={18} className="me-2" style={{ color: '#3b82f6' }} />Online Users ({users.length})
      </h6>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>  {/* <-- INCREASED HEIGHT AND SCROLLABLE */}
        {users.length === 0 ? (
          <div className="text-center py-3" style={{ color: '#64748b' }}>No users online</div>
        ) : (
          users.map((user, i) => (
            <div key={user.userId || i} className="d-flex align-items-center gap-2 p-2 rounded mb-2" style={{ backgroundColor: '#fafafa' }}>
              <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#10b981' }} />
              <div className="flex-grow-1">
                <div className="small fw-bold" style={{ color: '#0f172a' }}>
                  {user.role || 'Unknown'} (ID: {user.userId ? user.userId.slice(-6) : 'N/A'})
                </div>
                <div className="small" style={{ color: '#64748b' }}>
                  IP: {user.ip || 'Unknown'}
                  {user.geo && user.geo.country ? (
                    <span className="ms-2">
                      <MapPin size={12} className="me-1" />
                      {user.geo.city ? `${user.geo.city}, ` : ''}{user.geo.country}
                    </span>
                  ) : null}
                </div>
                <div className="small" style={{ color: '#94a3b8' }}>
                  Connected: {user.connectedAt ? new Date(user.connectedAt).toLocaleTimeString() : 'N/A'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default OnlineUserList;