// FULL FIXED DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import SparklineChart from '../components/SparklineChart';
import OnlineUserList from '../components/OnlineUserList';
import LiveActivityFeed from '../components/LiveActivityFeed';
import { monitorService } from '../services/monitorService';
import io from 'socket.io-client';
import { useContext } from 'react';
import { AuthContext } from '../../PrivateComponents/AuthContext';

const DashboardPage = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketStatus, setSocketStatus] = useState('Disconnected');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [sparklineData] = useState(() => Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)));

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!token) return;

    const BASE_URL = process.env.REACT_APP_API_BASE?.replace('/api', '') || 'http://localhost:5000';

    const socket = io(`${BASE_URL}/monitor`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    socket.on('connect', () => {
      setSocketStatus('Connected');
      socket.emit("join", "superadmin");
    });

    socket.on('connect_error', (err) => {
      setSocketStatus(`Error: ${err.message}`);
      console.error('Socket fail:', err);
    });

    socket.on('monitor:onlineUsers', (list) => {
      setOnlineUsers(list || []);
    });

    socket.on('alert:updated', (alert) => {
      setActivities(prev => [alert, ...prev].slice(0, 20));
    });

    socket.on('alert:new', (alert) => {
      setActivities(prev => [alert, ...prev].slice(0, 20));
    });

    return () => socket.disconnect();
  }, [token]);

  const loadStats = async () => {
    try {
      const data = await monitorService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Stats load fail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <PageHeader title="System Overview" subtitle="Real-time monitoring dashboard" />

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatCard label="Online Users" value={onlineUsers.length} icon={Users} color="success" subtitle={socketStatus} />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard label="Failed Logins" value={stats?.failedLoginsPastHour || 0} icon={AlertCircle} color="danger" subtitle="Past hour" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard label="New Alerts" value={stats?.openAlertsToday || 0} icon={AlertTriangle} color="warning" subtitle="Today" />
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