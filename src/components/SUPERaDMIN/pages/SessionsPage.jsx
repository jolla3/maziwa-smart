// ============================================
// FILE: /src/superadmin/pages/SessionsPage.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { RefreshCw, XCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { sessionService } from '../services/sessionService';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false });

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    try {
      const data = await sessionService.getSessions();
      setSessions(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleKill = async (id) => {
    try {
      await sessionService.killSession(id);
      loadSessions();
      setConfirmDialog({ open: false });
    } catch (e) { console.error(e); alert('Failed to disconnect'); }
  };

  const columns = [
    { key: 'userId', label: 'User ID' },
    { key: 'role', label: 'Role', render: (v) => <span className="badge bg-info">{v}</span> },
    { key: 'ip', label: 'IP Address' },
    { key: 'userAgent', label: 'User Agent', render: (v) => <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>{v || 'N/A'}</span> },
    { key: 'socketId', label: 'Socket ID' },
    { key: 'connectedAt', label: 'Connected', render: (v) => new Date(v).toLocaleString() }
  ];

  return (
    <div>
      <PageHeader title="Active Sessions" subtitle="Monitor and manage user sessions"
        actions={<button className="btn btn-primary" onClick={loadSessions}><RefreshCw size={16} className="me-1" />Refresh</button>} />

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          <div className="alert alert-info mb-3"><strong>{sessions.length}</strong> active session{sessions.length !== 1 ? 's' : ''}</div>
          <DataTable columns={columns} data={sessions}
            actions={(s) => (
              <button className="btn btn-sm btn-outline-danger" onClick={(e) => {
                e.stopPropagation();
                setConfirmDialog({ open: true, id: s._id, title: 'Force Disconnect', message: `Disconnect user ${s.userId}?` });
              }}><XCircle size={14} className="me-1" />Disconnect</button>
            )} />
        </>
      )}

      <ConfirmDialog open={confirmDialog.open} title={confirmDialog.title} message={confirmDialog.message}
        onConfirm={() => handleKill(confirmDialog.id)} onCancel={() => setConfirmDialog({ open: false })} />
    </div>
  );
};

export default SessionsPage;
