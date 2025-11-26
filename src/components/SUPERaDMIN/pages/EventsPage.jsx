
// ============================================
// FILE: /src/superadmin/pages/EventsPage.jsx
// FULL FILE - White drawer, proper theme
// ============================================
import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import DrawerPanel from '../components/DrawerPanel';
import FilterPanel from '../components/FilterPanel';
import { eventService } from '../services/eventService';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({ type: '', userId: '', ip: '', from: '', to: '', page: 1 });

  useEffect(() => { loadEvents(); }, [filters]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const data = await eventService.getEvents(clean);
      setEvents(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleView = async (event) => {
    try {
      const full = await eventService.getEvent(event._id);
      setSelectedEvent(full);
      setDrawerOpen(true);
    } catch (e) { console.error(e); }
  };

  const columns = [
    { key: 'createdAt', label: 'Timestamp', render: (v) => new Date(v).toLocaleString() },
    { key: 'type', label: 'Type', render: (v) => <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>{v}</span> },
    { key: 'userId', label: 'User ID' },
    { key: 'ip', label: 'IP Address' },
    { key: 'path', label: 'Path' }
  ];

  const filterConfig = [
    { key: 'type', label: 'Event Type', type: 'text', value: filters.type, placeholder: 'e.g. auth.login' },
    { key: 'userId', label: 'User ID', type: 'text', value: filters.userId, placeholder: 'User ID...' },
    { key: 'ip', label: 'IP Address', type: 'text', value: filters.ip, placeholder: 'IP...' },
    { key: 'from', label: 'From Date', type: 'datetime-local', value: filters.from },
    { key: 'to', label: 'To Date', type: 'datetime-local', value: filters.to }
  ];

  return (
    <div>
      <PageHeader title="Event Logs" subtitle="System event monitoring"
        actions={
          <button className="btn" style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none' }} onClick={loadEvents}>
            <RefreshCw size={16} className="me-1" />Refresh
          </button>
        } />

      <FilterPanel filters={filterConfig} onChange={(k, v) => setFilters(p => ({ ...p, [k]: v, page: 1 }))}
        onClear={() => setFilters({ type: '', userId: '', ip: '', from: '', to: '', page: 1 })} />

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: '#10b981' }}></div></div>
      ) : (
        <>
          <DataTable columns={columns} data={events} onRowClick={handleView}
            actions={(e) => (
              <button className="btn btn-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #10b981', color: '#10b981' }} 
                onClick={(ev) => { ev.stopPropagation(); handleView(e); }}>
                <Eye size={14} />
              </button>
            )} />
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }}
              disabled={filters.page === 1} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}>Previous</button>
            <span style={{ color: '#64748b' }}>Page {filters.page}</span>
            <button className="btn" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }}
              disabled={events.length < 50} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}>Next</button>
          </div>
        </>
      )}

      <DrawerPanel open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Event Details">
        {selectedEvent && (
          <div style={{ backgroundColor: '#ffffff' }}>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Event Type</h6>
              <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>{selectedEvent.type}</span>
            </div>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>User ID</h6>
              <p style={{ color: '#0f172a', margin: 0 }}>{selectedEvent.userId || 'N/A'}</p>
            </div>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>IP Address</h6>
              <p style={{ color: '#0f172a', margin: 0 }}>{selectedEvent.ip || 'N/A'}</p>
            </div>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Path</h6>
              <p style={{ color: '#0f172a', margin: 0 }}>{selectedEvent.path || 'N/A'}</p>
            </div>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Method</h6>
              <p style={{ color: '#0f172a', margin: 0 }}>{selectedEvent.method || 'N/A'}</p>
            </div>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>User Agent</h6>
              <p className="small" style={{ color: '#0f172a', margin: 0, wordBreak: 'break-word' }}>{selectedEvent.userAgent || 'N/A'}</p>
            </div>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Geo</h6>
              <p style={{ color: '#0f172a', margin: 0 }}>{selectedEvent.geo ? JSON.stringify(selectedEvent.geo) : 'N/A'}</p>
            </div>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Metadata</h6>
              <pre className="p-3 rounded small" style={{ backgroundColor: '#fafafa', border: '1px solid #e2e8f0', color: '#0f172a', overflow: 'auto' }}>
                {JSON.stringify(selectedEvent.metadata || {}, null, 2)}
              </pre>
            </div>
            <div className="mb-3">
              <h6 style={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Timestamp</h6>
              <p style={{ color: '#0f172a', margin: 0 }}>{new Date(selectedEvent.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DrawerPanel>
    </div>
  );
};

export default EventsPage;
