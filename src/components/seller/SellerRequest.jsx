import React, { useState } from 'react';
import SellerStep1Country from './SellerStep1Country';
import SellerStep2Otp from './SellerStep2Otp';
import SellerStep3Setup from './SellerStep3Setup';
import SellerStep4Terms from './SellerStep4Terms';

const SellerRequest = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = (data) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const prev = () => setStep(step - 1);

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100" 
      style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        padding: '20px'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div style={{ transition: 'all 0.3s ease' }}>
              {step === 1 && <SellerStep1Country next={next} />}
              {step === 2 && <SellerStep2Otp next={next} prev={prev} formData={formData} />}
              {step === 3 && <SellerStep3Setup next={next} prev={prev} formData={formData} />}
              {step === 4 && <SellerStep4Terms prev={prev} formData={formData} />}
            </div>
            
            <div className="text-center mt-4">
              <small className="text-muted">
                © 2025 MaziwaSmart. Secure Livestock Marketplace
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRequest;