// ============================================
// FILE: /src/superadmin/pages/AuditPage.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import DrawerPanel from '../components/DrawerPanel';
import FilterPanel from '../components/FilterPanel';
import JSONDiffViewer from '../components/JSONDiffViewer';
import { auditService } from '../services/auditService';

const AuditPage = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({ userId: '', listingId: '', action: '', page: 1 });

  useEffect(() => { loadAudits(); }, [filters]);

  const loadAudits = async () => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const data = await auditService.getAudit(clean);
      setAudits(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleView = async (audit) => {
    try {
      const full = await auditService.getAuditById(audit._id);
      setSelectedAudit(full);
      setDrawerOpen(true);
    } catch (e) { console.error(e); }
  };

  const columns = [
    { key: 'action', label: 'Action', render: (v) => <span className="badge bg-primary">{v}</span> },
    { key: 'userId', label: 'User ID' },
    { key: 'listingId', label: 'Listing ID' },
    { key: 'createdAt', label: 'Timestamp', render: (v) => new Date(v).toLocaleString() }
  ];

  const filterConfig = [
    { key: 'userId', label: 'User ID', type: 'text', value: filters.userId, placeholder: 'User ID...' },
    { key: 'listingId', label: 'Listing ID', type: 'text', value: filters.listingId, placeholder: 'Listing ID...' },
    { key: 'action', label: 'Action', type: 'select', value: filters.action, options: [{ value: 'create', label: 'Create' }, { value: 'update', label: 'Update' }, { value: 'delete', label: 'Delete' }] }
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Listing modification history"
        actions={<button className="btn btn-primary" onClick={loadAudits}><RefreshCw size={16} className="me-1" />Refresh</button>} />

      <FilterPanel filters={filterConfig} onChange={(k, v) => setFilters(p => ({ ...p, [k]: v, page: 1 }))}
        onClear={() => setFilters({ userId: '', listingId: '', action: '', page: 1 })} />

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          <DataTable columns={columns} data={audits} onRowClick={handleView}
            actions={(a) => <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); handleView(a); }}><Eye size={14} /></button>} />
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-outline-secondary" disabled={filters.page === 1}
              onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}>Previous</button>
            <span>Page {filters.page}</span>
            <button className="btn btn-outline-secondary" disabled={audits.length < 50}
              onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}>Next</button>
          </div>
        </>
      )}

      <DrawerPanel open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Audit Details">
        {selectedAudit && (
          <div>
            <div className="mb-3"><h6>Action</h6><span className="badge bg-primary">{selectedAudit.action}</span></div>
            <div className="mb-3"><h6>User ID</h6><p>{selectedAudit.userId}</p></div>
            <div className="mb-3"><h6>Listing ID</h6><p>{selectedAudit.listingId}</p></div>
            <div className="mb-3"><h6>Timestamp</h6><p>{new Date(selectedAudit.createdAt).toLocaleString()}</p></div>
            <div className="mb-3"><h6>Changes</h6><JSONDiffViewer before={selectedAudit.before || {}} after={selectedAudit.after || {}} /></div>
          </div>
        )}
      </DrawerPanel>
    </div>
  );
};

export default AuditPage;

