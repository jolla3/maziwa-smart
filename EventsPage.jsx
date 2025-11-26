// ============================================
// src/superadmin/pages/EventsPage.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { DrawerPanel } from '../components/DrawerPanel';
import { FilterPanel } from '../components/FilterPanel';
import { Button } from '../components/Button';
import { eventService } from '../services/eventService';
import { formatDate } from '../utils/formatters';
import styles from './EventsPage.module.css';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    userId: '',
    ip: '',
    from: '',
    to: ''
  });

  useEffect(() => {
    loadEvents();
  }, [currentPage, filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page: currentPage };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const data = await eventService.getEvents(params);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const filterConfig = [
    {
      key: 'type',
      label: 'Type',
      type: 'text',
      value: filters.type,
      placeholder: 'Event type'
    },
    {
      key: 'userId',
      label: 'User ID',
      type: 'text',
      value: filters.userId,
      placeholder: 'User ID'
    },
    {
      key: 'ip',
      label: 'IP Address',
      type: 'text',
      value: filters.ip,
      placeholder: 'IP address'
    },
    {
      key: 'from',
      label: 'From Date',
      type: 'datetime-local',
      value: filters.from
    },
    {
      key: 'to',
      label: 'To Date',
      type: 'datetime-local',
      value: filters.to
    }
  ];

  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'userId', label: 'User ID' },
    { key: 'ip', label: 'IP Address' },
    { key: 'method', label: 'Method' },
    { key: 'path', label: 'Path' },
    { 
      key: 'createdAt', 
      label: 'Timestamp',
      render: (value) => formatDate(value)
    }
  ];

  return (
    <div className={styles.page}>
      <PageHeader 
        title="Event Logs" 
        subtitle="System event monitoring and tracking"
        actions={
          <Button icon={RefreshCw} onClick={loadEvents}>
            Refresh
          </Button>
        }
      />

      <FilterPanel
        filters={filterConfig}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onClear={() => setFilters({ type: '', userId: '', ip: '', from: '', to: '' })}
      />

      {loading ? (
        <div className={styles.loading}>Loading events...</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={events}
            onRowClick={handleRowClick}
          />
          
          <div className={styles.pagination}>
            <Button 
              variant="secondary" 
              icon={ChevronLeft}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className={styles.pageNumber}>Page {currentPage}</span>
            <Button 
              variant="secondary" 
              icon={ChevronRight}
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={events.length < 50}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <DrawerPanel
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className={styles.drawerContent}>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>Type</div>
              <div className={styles.fieldValue}>{selectedEvent.type}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>User ID</div>
              <div className={styles.fieldValue}>{selectedEvent.userId || 'N/A'}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>IP Address</div>
              <div className={styles.fieldValue}>{selectedEvent.ip || 'N/A'}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>Method</div>
              <div className={styles.fieldValue}>{selectedEvent.method || 'N/A'}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>Path</div>
              <div className={styles.fieldValue}>{selectedEvent.path || 'N/A'}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>Timestamp</div>
              <div className={styles.fieldValue}>{formatDate(selectedEvent.createdAt)}</div>
            </div>
            {selectedEvent.geo && (
              <div className={styles.field}>
                <div className={styles.fieldLabel}>Geolocation</div>
                <pre className={styles.metadata}>
                  {JSON.stringify(selectedEvent.geo, null, 2)}
                </pre>
              </div>
            )}
            {selectedEvent.metadata && (
              <div className={styles.field}>
                <div className={styles.fieldLabel}>Metadata</div>
                <pre className={styles.metadata}>
                  {JSON.stringify(selectedEvent.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
};
