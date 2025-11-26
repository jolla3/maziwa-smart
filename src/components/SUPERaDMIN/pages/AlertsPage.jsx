// ============================================
// FULL CORRECTED AlertsPage.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { Eye, Trash2, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import DrawerPanel from '../components/DrawerPanel';
import FilterPanel from '../components/FilterPanel';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import { alertService } from '../services/alertService';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false });
  const [filters, setFilters] = useState({ status: 'open', type: '', severity: '' });

  useEffect(() => { loadAlerts(); }, [filters.status]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertService.getAlerts(filters.status);
      setAlerts(data);
    } catch (error) { console.error('Failed:', error); }
    finally { setLoading(false); }
  };

  const handleViewAlert = async (alert) => {
    try {
      const full = await alertService.getAlert(alert._id);
      setSelectedAlert(full);
      setDrawerOpen(true);
    } catch (error) { console.error('Failed:', error); }
  };

  const handleUpdateStatus = async (id, action) => {
    try {
      await alertService.updateAlert(id, { action });
      loadAlerts();
      setDrawerOpen(false);
    } catch (error) { console.error('Failed:', error); }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await alertService.deleteAlert(id);
      loadAlerts();
      setConfirmDialog({ open: false });
      setDrawerOpen(false);
    } catch (error) { console.error('Failed:', error); }
  };

  const columns = [
    { key: 'type', label: 'Type', render: (v) => <span className="badge bg-info">{v}</span> },
    { key: 'severity', label: 'Severity', render: (v) => <SeverityBadge level={v} /> },
    { key: 'message', label: 'Message' },
    { key: 'createdAt', label: 'Created', render: (v) => new Date(v).toLocaleString() },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> }
  ];

  const filterConfig = [
    { key: 'status', label: 'Status', type: 'select', value: filters.status, options: [{ value: 'open', label: 'Open' }, { value: 'reviewing', label: 'Reviewing' }, { value: 'closed', label: 'Closed' }] },
    { key: 'type', label: 'Type', type: 'text', value: filters.type, placeholder: 'Filter by type...' },
    { key: 'severity', label: 'Severity', type: 'select', value: filters.severity, options: [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }] }
  ];

  return (
    <div>
      <PageHeader title="Alert Management" subtitle="Monitor and manage system alerts"
        actions={<button className="btn btn-primary" onClick={loadAlerts}><RefreshCw size={16} className="me-1" />Refresh</button>} />

      <FilterPanel filters={filterConfig} onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))} 
        onClear={() => setFilters({ status: 'open', type: '', severity: '' })} />

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={alerts} onRowClick={handleViewAlert}
          actions={(a) => (
            <>
              <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); handleViewAlert(a); }}><Eye size={14} /></button>
              <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); setConfirmDialog({ open: true, id: a._id, title: 'Delete Alert', message: 'Are you sure?' }); }}><Trash2 size={14} /></button>
            </>
          )} />
      )}

      <DrawerPanel open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Alert Details">
        {selectedAlert && (
          <div>
            <div className="mb-3"><h6>Type</h6><span className="badge bg-info">{selectedAlert.type}</span></div>
            <div className="mb-3"><h6>Severity</h6><SeverityBadge level={selectedAlert.severity} /></div>
            <div className="mb-3"><h6>Status</h6><StatusBadge status={selectedAlert.status} /></div>
            <div className="mb-3"><h6>Message</h6><p>{selectedAlert.message}</p></div>
            <div className="mb-3"><h6>Metadata</h6><pre className="bg-light p-3 rounded small">{JSON.stringify(selectedAlert.metadata || {}, null, 2)}</pre></div>
            <div className="mb-3"><h6>Created At</h6><p>{new Date(selectedAlert.createdAt).toLocaleString()}</p></div>
            <div className="d-flex gap-2">
              <button className="btn btn-warning btn-sm" onClick={() => handleUpdateStatus(selectedAlert._id, 'reviewing')}>Mark Reviewing</button>
              <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(selectedAlert._id, 'close')}>Close Alert</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(selectedAlert._id, 'escalate')}>Escalate</button>
            </div>
          </div>
        )}
      </DrawerPanel>

      <ConfirmDialog open={confirmDialog.open} title={confirmDialog.title} message={confirmDialog.message}
        onConfirm={() => handleDeleteAlert(confirmDialog.id)} onCancel={() => setConfirmDialog({ open: false })} />
    </div>
  );
};

export default AlertsPage;
