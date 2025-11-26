// ============================================
// FILE: /src/superadmin/pages/ConfigPage.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { configService } from '../services/configService';

const ConfigPage = () => {
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editValues, setEditValues] = useState({});

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await configService.getConfig();
      setConfig(data);
      const values = {};
      data.forEach(item => { values[item.key] = item.value; });
      setEditValues(values);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await configService.updateConfig(editValues);
      alert('Configuration updated successfully');
      loadConfig();
    } catch (e) { console.error(e); alert('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleReset = () => {
    const values = {};
    config.forEach(item => { values[item.key] = item.value; });
    setEditValues(values);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <PageHeader title="System Configuration" subtitle="Manage monitoring thresholds"
        actions={
          <>
            <button className="btn btn-outline-secondary" onClick={handleReset}><RotateCcw size={16} className="me-1" />Reset</button>
            <button className="btn btn-outline-primary" onClick={loadConfig}><RefreshCw size={16} className="me-1" />Refresh</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}><Save size={16} className="me-1" />{saving ? 'Saving...' : 'Save'}</button>
          </>
        } />

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead className="bg-light">
                <tr><th className="border-0">Configuration Key</th><th className="border-0">Value</th><th className="border-0">Last Updated</th></tr>
              </thead>
              <tbody>
                {config.map((item, i) => (
                  <tr key={i}>
                    <td className="align-middle"><code>{item.key}</code></td>
                    <td className="align-middle">
                      <input type="number" className="form-control" value={editValues[item.key] || ''}
                        onChange={(e) => setEditValues(p => ({ ...p, [item.key]: parseFloat(e.target.value) }))} />
                    </td>
                    <td className="align-middle text-muted small">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-4">
        <strong>Configuration Keys:</strong>
        <ul className="mb-0 mt-2">
          <li><code>failedLogin.threshold</code> - Max failed logins before alert</li>
          <li><code>spamListing.threshold</code> - Listings to trigger spam detection</li>
          <li><code>spamListing.similarity.threshold</code> - Similarity % for duplicates</li>
          <li><code>alert.dedupe.minutes</code> - Minutes to dedupe alerts</li>
          <li><code>worker.loop.ms</code> - Worker loop interval (ms)</li>
        </ul>
      </div>
    </div>
  );
};

export default ConfigPage;
