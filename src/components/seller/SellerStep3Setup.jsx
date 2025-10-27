import React, { useState } from 'react';
import { Phone, Lock, MapPin, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import StepIndicator from './StepIndicator';

const SellerStep3Setup = ({ next, prev, formData }) => {
  const [setupData, setSetupData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    county: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (setupData.password !== setupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (setupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    next(setupData);
  };

  const passwordStrength = () => {
    const len = setupData.password.length;
    if (len === 0) return { width: '0%', color: '#e2e8f0', text: '' };
    if (len < 6) return { width: '33%', color: '#fc8181', text: 'Weak' };
    if (len < 10) return { width: '66%', color: '#f6ad55', text: 'Medium' };
    return { width: '100%', color: '#48bb78', text: 'Strong' };
  };

  const strength = passwordStrength();

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
      <div className="card-body p-5">
        <StepIndicator currentStep={3} />
        
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3" 
            style={{ 
              width: '64px', 
              height: '64px', 
              background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', 
              borderRadius: '16px' 
            }}
          >
            <Lock size={32} color="white" />
          </div>
          <h3 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Setup Your Account</h3>
          <p className="text-muted mb-0">Create your secure seller credentials</p>
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

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '14px' }}>
              Phone Number
            </label>
            <div className="input-group" style={{ height: '48px' }}>
              <span 
                className="input-group-text bg-white border-end-0" 
                style={{ borderRadius: '12px 0 0 12px', borderColor: '#e2e8f0' }}
              >
                <Phone size={20} color="#94a3b8" />
              </span>
              <input
                type="tel"
                className="form-control border-start-0 ps-0"
                placeholder="+254712345678"
                value={setupData.phone}
                onChange={(e) => setSetupData({ ...setupData, phone: e.target.value })}
                required
                style={{ borderRadius: '0 12px 12px 0', borderColor: '#e2e8f0', fontSize: '15px' }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '14px' }}>
              County
            </label>
            <div className="input-group" style={{ height: '48px' }}>
              <span 
                className="input-group-text bg-white border-end-0" 
                style={{ borderRadius: '12px 0 0 12px', borderColor: '#e2e8f0' }}
              >
                <MapPin size={20} color="#94a3b8" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="e.g., Nairobi"
                value={setupData.county}
                onChange={(e) => setSetupData({ ...setupData, county: e.target.value })}
                required
                style={{ borderRadius: '0 12px 12px 0', borderColor: '#e2e8f0', fontSize: '15px' }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '14px' }}>
              Password
            </label>
            <div className="input-group" style={{ height: '48px' }}>
              <span 
                className="input-group-text bg-white border-end-0" 
                style={{ borderRadius: '12px 0 0 0', borderColor: '#e2e8f0' }}
              >
                <Lock size={20} color="#94a3b8" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0 ps-0"
                placeholder="Enter password"
                value={setupData.password}
                onChange={(e) => setSetupData({ ...setupData, password: e.target.value })}
                required
                style={{ borderColor: '#e2e8f0', fontSize: '15px' }}
              />
              <button
                type="button"
                className="btn border-start-0"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  borderRadius: '0 12px 0 0', 
                  borderColor: '#e2e8f0', 
                  background: 'white' 
                }}
              >
                {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
              </button>
            </div>
            {setupData.password && (
              <div className="mt-2">
                <div className="d-flex justify-content-between mb-1">
                  <small style={{ color: '#718096', fontSize: '12px' }}>Password strength</small>
                  <small style={{ color: strength.color, fontSize: '12px', fontWeight: '600' }}>
                    {strength.text}
                  </small>
                </div>
                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: strength.width, 
                      height: '100%', 
                      background: strength.color, 
                      transition: 'all 0.3s ease' 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '14px' }}>
              Confirm Password
            </label>
            <div className="input-group" style={{ height: '48px' }}>
              <span 
                className="input-group-text bg-white border-end-0" 
                style={{ borderRadius: '12px 0 0 12px', borderColor: '#e2e8f0' }}
              >
                <Lock size={20} color="#94a3b8" />
              </span>
              <input
                type="password"
                className="form-control border-start-0 ps-0"
                placeholder="Confirm password"
                value={setupData.confirmPassword}
                onChange={(e) => setSetupData({ ...setupData, confirmPassword: e.target.value })}
                required
                style={{ borderRadius: '0 12px 12px 0', borderColor: '#e2e8f0', fontSize: '15px' }}
              />
            </div>
          </div>

          <div className="d-flex gap-2">
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
              style={{
                height: '48px',
                background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                fontSize: '15px'
              }}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerStep3Setup;