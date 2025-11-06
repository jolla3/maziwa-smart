import React, { useState } from 'react';
import { FileText, ArrowLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import StepIndicator from './StepIndicator';

const SellerStep4Terms = ({ prev, formData }) => {
  const [accepted, setAccepted] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;
    if (bottom) setScrolledToBottom(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://maziwasmart.onrender.com/api/seller-request/complete-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          county: formData.county,
          consent: accepted
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card border-0 shadow-sm text-center" style={{ borderRadius: '16px' }}>
        <div className="card-body p-5">
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3" 
            style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', 
              borderRadius: '20px' 
            }}
          >
            <CheckCircle2 size={40} color="white" />
          </div>
          <h3 className="fw-bold mb-3" style={{ color: '#1a202c' }}>Request Submitted!</h3>
          <p className="text-muted mb-4">
            Your seller application has been submitted successfully. Our admin team will review your request and notify you via email once approved.
          </p>
          <div 
            className="alert alert-light d-flex align-items-start" 
            style={{ 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              background: '#f7fafc' 
            }}
          >
            <Info size={20} color="#2EAADC" className="me-2 mt-1" />
            <div className="text-start">
              <small className="d-block mb-1" style={{ color: '#1a202c', fontWeight: '600' }}>
                What happens next?
              </small>
              <small className="text-muted">
                You'll receive an email notification once your account is approved. This typically takes 1-2 business days.
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
      <div className="card-body p-5">
        <StepIndicator currentStep={4} />
        
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3" 
            style={{ 
              width: '64px', 
              height: '64px', 
              background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)', 
              borderRadius: '16px' 
            }}
          >
            <FileText size={32} color="white" />
          </div>
          <h3 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Seller Agreement</h3>
          <p className="text-muted mb-0">Please review and accept the terms below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div 
            className="mb-4 p-4" 
            onScroll={handleScroll}
            style={{ 
              maxHeight: '300px', 
              overflowY: 'auto', 
              background: '#f7fafc', 
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#4a5568'
            }}
          >
            <div style={{ fontWeight: '700', marginBottom: '16px', color: '#1a202c', fontSize: '15px' }}>
              Seller Terms & Conditions — MaziwaSmart Marketplace
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>1. Honest & Accurate Information:</strong> You confirm that all details you provide are true.
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>2. Responsible Trading:</strong> You only list genuine livestock or farm products that you own.
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>3. No Fraud or Misuse:</strong> Fake listings or scams lead to account termination and legal action.
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>4. Verification:</strong> You understand approval by the SuperAdmin is required before listing.
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>5. Communication:</strong> You allow MaziwaSmart to contact you for account and trade updates.
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>6. Privacy:</strong> Your data will be handled securely and confidentially.
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>7. Suspension:</strong> MaziwaSmart may suspend violators of these terms.
            </div>
          </div>

          {!scrolledToBottom && (
            <div 
              className="alert alert-warning d-flex align-items-center mb-3" 
              style={{ 
                borderRadius: '12px', 
                border: 'none', 
                background: '#fef5e7', 
                fontSize: '13px' 
              }}
            >
              <Info size={18} color="#f6ad55" className="me-2" />
              <small>Please scroll to the bottom to continue</small>
            </div>
          )}

          <div 
            className="form-check mb-4 p-3" 
            style={{ 
              background: '#f7fafc', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0' 
            }}
          >
            <input
              className="form-check-input"
              type="checkbox"
              id="acceptTerms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              disabled={!scrolledToBottom}
              style={{ 
                width: '20px', 
                height: '20px',
                marginTop: '2px',
                cursor: scrolledToBottom ? 'pointer' : 'not-allowed'
              }}
            />
            <label 
              className="form-check-label ms-2" 
              htmlFor="acceptTerms"
              style={{ 
                fontSize: '14px', 
                color: '#4a5568',
                cursor: scrolledToBottom ? 'pointer' : 'not-allowed'
              }}
            >
              I have read and agree to the MaziwaSmart Seller Terms & Conditions
            </label>
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
              className="btn flex-grow-1 d-flex align-items-center justify-content-center"
              disabled={!accepted || loading}
              style={{
                height: '48px',
                background: (!accepted || loading) ? '#cbd5e0' : 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                fontSize: '15px'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit for Approval
                  <ArrowRight size={18} className="ms-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerStep4Terms;