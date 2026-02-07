// ============================================
// FILE: /src/superadmin/components/LiveActivityFeed.jsx
// ============================================
import React from 'react';
import { Activity } from 'lucide-react';

const LiveActivityFeed = ({ activities = [] }) => (
  <div className="card border-0 shadow-lg h-100">
    <div className="card-body">
      <h6 className="card-title mb-3" style={{ color: '#0f172a', fontWeight: 600 }}>
        <Activity size={18} className="me-2" style={{ color: '#10b981' }} />Live Activity
      </h6>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {activities.length === 0 ? (
          <div className="text-center py-3" style={{ color: '#64748b' }}>No recent activity</div>
        ) : (
          activities.map((a, i) => (
            <div key={i} className="border-bottom pb-2 mb-2">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="badge me-2" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>{a.type}</span>  {/* type displayed as badge */}
                  <span className="small" style={{ color: '#0f172a' }}>{a.message}</span>  {/* <-- MESSAGE SEPARATELY */}
                </div>
                <span className="small" style={{ color: '#64748b' }}>{new Date(a.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default LiveActivityFeed;