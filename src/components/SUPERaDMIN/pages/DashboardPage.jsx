// FULL FIXED DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle, AlertTriangle, Shield, TrendingUp, RefreshCw, Settings, AlertTriangle as AlertIcon, FileText, Users as UsersIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import SparklineChart from '../components/SparklineChart';
import OnlineUserList from '../components/OnlineUserList';
import LiveActivityFeed from '../components/LiveActivityFeed';
import { monitorService } from '../services/monitorService';
import { eventService } from '../services/eventService';
import { io } from 'socket.io-client';
import { useContext } from 'react';
import { AuthContext } from '../../PrivateComponents/AuthContext';

const DashboardPage = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketStatus, setSocketStatus] = useState('Disconnected');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [sparklineData, setSparklineData] = useState([]);

  useEffect(() => {
    loadStats();
    loadEventsForChart();
    loadOnlineUsers();  // <-- ADD: Initial load for online users
    const interval = setInterval(loadStats, 30000);
    const chartInterval = setInterval(loadEventsForChart, 60000);
    const usersInterval = setInterval(loadOnlineUsers, 10000);  // <-- ADD: Poll online users every 10s as fallback
    return () => {
      clearInterval(interval);
      clearInterval(chartInterval);
      clearInterval(usersInterval);
    };
  }, []);

  // <-- ADD: Function to load online users (API fallback)
  const loadOnlineUsers = async () => {
    try {
      const data = await monitorService.getOnlineUsers();
      console.log('Loaded online users from API:', data.users);  // <-- DEBUG
      setOnlineUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load online users:', error);
    }
  };

  const loadEventsForChart = async () => {
    try {
      const from = new Date(Date.now() - 20 * 60 * 1000).toISOString();
      const events = await eventService.getEvents({ from, to: new Date().toISOString() });
      const minuteCounts = {};
      events.forEach(event => {
        const minute = new Date(event.createdAt).getMinutes();
        minuteCounts[minute] = (minuteCounts[minute] || 0) + 1;
      });
      const data = Array.from({ length: 20 }, (_, i) => {
        const minute = (new Date().getMinutes() - 19 + i + 60) % 60;
        return minuteCounts[minute] || 0;
      });
      setSparklineData(data);
    } catch (error) {
      console.error('Failed to load events for chart:', error);
      setSparklineData(Array.from({ length: 20 }, () => 0));
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const envBase = process.env.REACT_APP_API_BASE;
    if (!envBase) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('REACT_APP_API_BASE must be set in production');
      } else {
        console.warn('REACT_APP_API_BASE is not set; sockets may not connect in development.');
      }
    }

    const socketBase = (envBase || '').replace('/api', '');

    const socket = io(`${socketBase}/monitor`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    socket.on('connect', () => {
      setSocketStatus('Connected');
      console.log('Dashboard socket connected');  // <-- DEBUG
    });

    socket.on('connect_error', (err) => {
      setSocketStatus(`Error: ${err.message}`);
      console.error('Dashboard socket error:', err);  // <-- DEBUG
    });

    socket.on('monitor:onlineUsers', (list) => {
      console.log('Received monitor:onlineUsers:', list);  // <-- DEBUG
      setOnlineUsers(list || []);
    });

    socket.on('activity:new', (activity) => {
      console.log('Received activity:new:', activity);  // <-- DEBUG
      setActivities(prev => [activity, ...prev].slice(0, 20));
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

  const handleRefresh = () => {
    loadStats();
    loadEventsForChart();
    loadOnlineUsers();  // <-- ADD: Refresh online users
    setActivities([]);
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader
        title="System Overview"
        subtitle="Real-time monitoring dashboard"
        actions={
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" onClick={handleRefresh}>
              <RefreshCw size={16} className="me-1" /> Refresh
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/spr.dmn/alerts')}>
              <AlertIcon size={16} className="me-1" /> Alerts
            </button>
            <button className="btn btn-outline-info" onClick={() => navigate('/spr.dmn/events')}>
              <FileText size={16} className="me-1" /> Events
            </button>
            <button className="btn btn-outline-success" onClick={() => navigate('/spr.dmn/sessions')}>
              <UsersIcon size={16} className="me-1" /> Sessions
            </button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="row g-4 mb-5">
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

      {/* Online Users - Full Width */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <OnlineUserList users={onlineUsers} />
        </div>
      </div>

      {/* Chart - Full Width */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-lg">
            <div className="card-body">
              <h6 className="card-title mb-3"><TrendingUp size={18} className="me-2 text-primary" />Events per Minute</h6>
              <SparklineChart data={sparklineData} />
              <div className="text-muted small mt-2">Total events today: {stats?.totalEventsToday || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed - Full Width */}
      <div className="row g-4">
        <div className="col-12">
          <LiveActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;