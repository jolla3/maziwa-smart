// ============================================
// FULL CORRECTED DashboardPage.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import SparklineChart from '../components/SparklineChart';
import OnlineUserList from '../components/OnlineUserList';
import LiveActivityFeed from '../components/LiveActivityFeed';
import { monitorService } from '../services/monitorService';
import { useAdminSocket } from '../hook/useAdminSocket';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sparklineData] = useState(() => Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)));
  const { isConnected, onlineUsers, activities } = useAdminSocket();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const data = await monitorService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div>
      <PageHeader title="System Overview" subtitle="Real-time monitoring dashboard" />

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatCard label="Online Users" value={onlineUsers.length} icon={Users} color="success" subtitle={isConnected ? 'Connected' : 'Disconnected'} />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard label="Failed Logins" value={stats?.failedLoginsPastHour || 0} icon={AlertCircle} color="danger" subtitle="Past hour" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard label="New Alerts" value={stats?.newAlerts || 0} icon={AlertTriangle} color="warning" subtitle="Today" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard label="Suspicious Listings" value={stats?.suspiciousListings || 0} icon={Shield} color="danger" subtitle="Flagged" />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title mb-3"><TrendingUp size={18} className="me-2" />Events per Minute</h6>
              <SparklineChart data={sparklineData} />
              <div className="text-muted small mt-2">Total events today: {stats?.totalEventsToday || 0}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <OnlineUserList users={onlineUsers} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12"><LiveActivityFeed activities={activities} /></div>
      </div>
    </div>
  );
};

export default DashboardPage;
