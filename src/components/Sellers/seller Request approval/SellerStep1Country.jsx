import React, { useState } from 'react';
import { Mail, Globe, Send, AlertCircle } from 'lucide-react';
import StepIndicator from './StepIndicator';

const SellerStep1Country = ({ next }) => {
  const [formData, setFormData] = useState({ email: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://maziwasmart.onrender.com/api/seller-request/request-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        next(formData);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
      <div className="card-body p-5">
        <StepIndicator currentStep={1} />
        
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3" 
            style={{ 
              width: '64px', 
              height: '64px', 
              background: 'linear-gradient(135deg, #2EAADC 0%, #1a8eb8 100%)', 
              borderRadius: '16px' 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Become a Seller</h3>
          <p className="text-muted mb-0">Join MaziwaSmart marketplace and start selling</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div 
              className="alert alert-danger d-flex align-items-center mb-3" 
              style={{ borderRadius: '12px', border: 'none', background: '#fee' }}
            >
              <AlertCircle size={18} className="me-2" />
              <small>{error}</small>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '14px' }}>
              Email Address
            </label>
            <div className="input-group" style={{ height: '48px' }}>
              <span 
                className="input-group-text bg-white border-end-0" 
                style={{ borderRadius: '12px 0 0 12px', borderColor: '#e2e8f0' }}
              >
                <Mail size={20} color="#94a3b8" />
              </span>
              <input
                type="email"
                className="form-control border-start-0 ps-0"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ 
                  borderRadius: '0 12px 12px 0', 
                  borderColor: '#e2e8f0', 
                  fontSize: '15px' 
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '14px' }}>
              Country
            </label>
            <div className="input-group" style={{ height: '48px' }}>
              <span 
                className="input-group-text bg-white border-end-0" 
                style={{ borderRadius: '12px 0 0 12px', borderColor: '#e2e8f0' }}
              >
                <Globe size={20} color="#94a3b8" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="e.g., Kenya"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                style={{ 
                  borderRadius: '0 12px 12px 0', 
                  borderColor: '#e2e8f0', 
                  fontSize: '15px' 
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 d-flex align-items-center justify-content-center"
            disabled={loading}
            style={{
              height: '48px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2EAADC 0%, #1a8eb8 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending OTP...
              </>
            ) : (
              <>
                Request OTP
                <Send size={18} className="ms-2" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerStep1Country;