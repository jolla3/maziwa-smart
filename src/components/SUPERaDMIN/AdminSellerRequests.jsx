import React, { useState, useEffect, useContext } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  AlertCircle,
  Loader,
  Shield,
  RefreshCw
} from 'lucide-react';
import { AuthContext } from '../PrivateComponents/AuthContext';

const AdminSellerRequests = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('pending');
  
   const Base_API = process.env.REACT_APP_API_BASE


  // Check if user is authorized
  useEffect(() => {
    if (!user || !['admin', 'superadmin'].includes(user.role)) {
      setError('You are not authorized to access this page');
      setLoading(false);
    }
  }, [user]);

  // Fetch requests based on filter
  const fetchRequests = async (status = filter) => {
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
   
    try {
      // Build URL with status query parameter
      const url = status === 'all'
        ? `${Base_API}/approval/seller-requests`
        : `${Base_API}/approval/seller-requests?status=${status}`;

      console.log('🔍 Fetching:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setError('Session expired or unauthorized. Please login again.');
        setTimeout(() => logout(), 2000);
        return;
      }

      if (data.success) {
        setRequests(data.requests || []);
        console.log('✅ Loaded', data.requests?.length, 'requests');
      } else {
        setError(data.message || 'Failed to fetch requests');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Network error. Please check your connection and backend server.');
    } finally {
      setLoading(false);
    }
  };

  // Review request (approve/reject)
  const handleReview = async (requestId, decision) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setProcessingId(requestId);

    try {
      const response = await fetch(`${Base_API}/approval/seller-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ decision })
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setError('Session expired. Please login again.');
        setTimeout(() => logout(), 2000);
        return;
      }

      if (data.success) {
        // Refresh the list with current filter
        fetchRequests(filter);
      } else {
        setError(data.message || 'Action failed');
      }
    } catch (err) {
      console.error('❌ Review error:', err);
      setError('Network error. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  // Fetch on mount and when filter changes
  useEffect(() => {
    if (user && ['admin', 'superadmin'].includes(user.role)) {
      fetchRequests(filter);
    }
  }, [filter, token, user]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '20px'
    }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <div className="d-flex align-items-center mb-2">
                  <div 
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #2EAADC 0%, #1a8eb8 100%)',
                      borderRadius: '12px'
                    }}
                  >
                    <Shield size={24} color="white" />
                  </div>
                  <div>
                    <h2 className="mb-0 fw-bold" style={{ color: '#1a202c' }}>Seller Requests</h2>
                    <small className="text-muted">
                      Welcome, {user?.fullname || user?.username || user?.role}
                    </small>
                  </div>
                </div>
              </div>

              <button
                onClick={() => fetchRequests(filter)}
                disabled={loading}
                className="btn btn-light d-flex align-items-center"
                style={{ 
                  borderRadius: '10px', 
                  border: '1px solid #e2e8f0',
                  padding: '10px 20px'
                }}
              >
                <RefreshCw size={18} className={`me-2 ${loading ? 'spin' : ''}`} />
                Refresh
                <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div 
              className="card border-0 shadow-sm"
              style={{ borderRadius: '12px', background: 'white' }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Clock size={24} color="white" />
                  </div>
                  <div className="ms-3">
                    <h3 className="mb-0 fw-bold" style={{ color: '#1a202c' }}>
                      {requests.filter(r => r.status === 'pending').length}
                    </h3>
                    <small className="text-muted">Pending Requests</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div 
              className="card border-0 shadow-sm"
              style={{ borderRadius: '12px', background: 'white' }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircle size={24} color="white" />
                  </div>
                  <div className="ms-3">
                    <h3 className="mb-0 fw-bold" style={{ color: '#1a202c' }}>
                      {requests.filter(r => r.status === 'approved').length}
                    </h3>
                    <small className="text-muted">Approved</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div 
              className="card border-0 shadow-sm"
              style={{ borderRadius: '12px', background: 'white' }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <XCircle size={24} color="white" />
                  </div>
                  <div className="ms-3">
                    <h3 className="mb-0 fw-bold" style={{ color: '#1a202c' }}>
                      {requests.filter(r => r.status === 'rejected').length}
                    </h3>
                    <small className="text-muted">Rejected</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="row mb-3">
          <div className="col-12">
            <div 
              className="btn-group w-100" 
              role="group"
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              {['pending', 'approved', 'rejected', 'all'].map(status => (
                <button
                  key={status}
                  type="button"
                  className={`btn ${filter === status ? '' : 'btn-light'}`}
                  onClick={() => setFilter(status)}
                  style={{
                    background: filter === status 
                      ? 'linear-gradient(135deg, #2EAADC 0%, #1a8eb8 100%)' 
                      : 'transparent',
                    color: filter === status ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: filter === status ? '600' : '400',
                    textTransform: 'capitalize'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="alert alert-danger d-flex align-items-center mb-4" 
            style={{ borderRadius: '12px', border: 'none' }}
          >
            <AlertCircle size={20} className="me-2" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <Loader size={40} className="mb-3" style={{ animation: 'spin 1s linear infinite', color: '#2EAADC' }} />
            <p className="text-muted">Loading requests...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : requests.length === 0 ? (
          <div 
            className="card border-0 shadow-sm text-center py-5"
            style={{ borderRadius: '12px' }}
          >
            <div className="card-body">
              <Users size={48} color="#cbd5e0" className="mb-3" />
              <h5 className="text-muted">No {filter} requests found</h5>
              <small className="text-muted">Check back later or try a different filter</small>
            </div>
          </div>
        ) : (
          <div className="row">
            {requests.map((request) => (
              <div key={request._id} className="col-12 col-lg-6 mb-4">
                <div 
                  className="card border-0 shadow-sm h-100"
                  style={{ borderRadius: '12px', background: 'white' }}
                >
                  <div className="card-body p-4">
                    {/* Header with Status Badge */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div 
                          style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Users size={20} color="white" />
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bold" style={{ color: '#1a202c' }}>
                            {request.seller_id?.fullname || request.seller_id?.username || 'Unknown Seller'}
                          </h6>
                          <small className="text-muted">
                            {request.seller_id?.role || 'seller'}
                          </small>
                        </div>
                      </div>

                      <span 
                        className="badge"
                        style={{
                          background: 
                            request.status === 'approved' ? '#d4edda' :
                            request.status === 'rejected' ? '#f8d7da' :
                            '#fff3cd',
                          color:
                            request.status === 'approved' ? '#155724' :
                            request.status === 'rejected' ? '#721c24' :
                            '#856404',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}
                      >
                        {request.status}
                      </span>
                    </div>

                    {/* Seller Details */}
                    <div className="mb-3" style={{ 
                      background: '#f7fafc', 
                      padding: '16px', 
                      borderRadius: '10px' 
                    }}>
                      <div className="d-flex align-items-center mb-2">
                        <Mail size={16} color="#94a3b8" className="me-2" />
                        <small style={{ color: '#4a5568' }}>
                          {request.seller_id?.email || request.email || 'N/A'}
                        </small>
                      </div>

                      {request.phone && (
                        <div className="d-flex align-items-center mb-2">
                          <Phone size={16} color="#94a3b8" className="me-2" />
                          <small style={{ color: '#4a5568' }}>{request.phone}</small>
                        </div>
                      )}

                      {request.county && (
                        <div className="d-flex align-items-center mb-2">
                          <MapPin size={16} color="#94a3b8" className="me-2" />
                          <small style={{ color: '#4a5568' }}>{request.county}, {request.country || 'Kenya'}</small>
                        </div>
                      )}

                      <div className="d-flex align-items-center">
                        <Calendar size={16} color="#94a3b8" className="me-2" />
                        <small style={{ color: '#4a5568' }}>
                          Requested: {new Date(request.created_at || request.seller_id?.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {request.status === 'pending' && (
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleReview(request._id, 'approve')}
                          disabled={processingId === request._id}
                          className="btn flex-grow-1 d-flex align-items-center justify-content-center"
                          style={{
                            height: '44px',
                            background: processingId === request._id 
                              ? '#cbd5e0' 
                              : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          {processingId === request._id ? (
                            <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <>
                              <CheckCircle size={18} className="me-2" />
                              Approve
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleReview(request._id, 'reject')}
                          disabled={processingId === request._id}
                          className="btn flex-grow-1 d-flex align-items-center justify-content-center"
                          style={{
                            height: '44px',
                            background: processingId === request._id 
                              ? '#cbd5e0' 
                              : 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          {processingId === request._id ? (
                            <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <>
                              <XCircle size={18} className="me-2" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Already Processed Badge */}
                    {request.status !== 'pending' && (
                      <div 
                        className="text-center py-2"
                        style={{ 
                          background: '#f7fafc', 
                          borderRadius: '10px',
                          fontSize: '13px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}
                      >
                        {request.status === 'approved' ? '✅ Already Approved' : '❌ Already Rejected'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellerRequests;