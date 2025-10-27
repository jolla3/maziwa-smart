import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import StepIndicator from './StepIndicator';

const SellerStep2Otp = ({ next, prev, formData }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://maziwasmart.onrender.com/api/seller-request/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });

      const data = await response.json();

      if (data.success) {
        next({ otp });
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const response = await fetch('https://maziwasmart.onrender.com/api/seller-request/request-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, country: formData.country })
      });
      
      const data = await response.json();
      if (data.success) {
        setError('');
        // You could show a success message here
      }
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
      <div className="card-body p-5">
        <StepIndicator currentStep={2} />
        
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3" 
            style={{ 
              width: '64px', 
              height: '64px', 
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', 
              borderRadius: '16px' 
            }}
          >
            <ShieldCheck size={32} color="white" />
          </div>
          <h3 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Verify Your Email</h3>
          <p className="text-muted mb-0">
            Enter the 6-digit code sent to<br/>
            <strong>{formData.email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify}>
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
            <input
              type="text"
              className="form-control text-center"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              required
              style={{
                height: '64px',
                fontSize: '28px',
                letterSpacing: '8px',
                fontWeight: '700',
                borderRadius: '12px',
                borderColor: '#e2e8f0',
                background: '#f7fafc'
              }}
            />
          </div>

          <div className="d-flex gap-2 mb-3">
            <button
              type="button"
              onClick={prev}
              className="btn btn-light"
              style={{ 
                height: '48px', 
                borderRadius: '12px', 
                flex: '0 0 48px', 
                border: '1px solid #e2e8f0' 
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="submit"
              className="btn flex-grow-1"
              disabled={loading || otp.length !== 6}
              style={{
                height: '48px',
                background: (loading || otp.length !== 6) ? '#cbd5e0' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                fontSize: '15px'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="btn btn-link text-decoration-none"
              style={{ color: '#2EAADC', fontSize: '14px' }}
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerStep2Otp;