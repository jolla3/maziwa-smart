import React from 'react';
import { CheckCircle } from 'lucide-react';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Email Verification' },
    { number: 2, label: 'OTP Code' },
    { number: 3, label: 'Account Setup' },
    { number: 4, label: 'Terms & Approval' }
  ];

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="d-flex flex-column align-items-center" style={{ flex: '0 0 auto' }}>
              <div
                className="d-flex align-items-center justify-content-center mb-2"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step.number <= currentStep 
                    ? 'linear-gradient(135deg, #2EAADC 0%, #1a8eb8 100%)' 
                    : '#e2e8f0',
                  color: step.number <= currentStep ? 'white' : '#a0aec0',
                  fontWeight: '700',
                  fontSize: '15px',
                  transition: 'all 0.3s ease'
                }}
              >
                {step.number < currentStep ? (
                  <CheckCircle size={20} />
                ) : (
                  step.number
                )}
              </div>
              <small 
                className="text-center d-none d-md-block" 
                style={{ 
                  fontSize: '11px', 
                  color: step.number === currentStep ? '#2EAADC' : '#a0aec0',
                  fontWeight: step.number === currentStep ? '600' : '400',
                  maxWidth: '80px'
                }}
              >
                {step.label}
              </small>
            </div>
            {index < steps.length - 1 && (
              <div 
                style={{ 
                  flex: '1 1 auto', 
                  height: '2px', 
                  background: step.number < currentStep ? '#2EAADC' : '#e2e8f0',
                  margin: '0 8px',
                  marginBottom: '32px',
                  transition: 'all 0.3s ease'
                }} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;