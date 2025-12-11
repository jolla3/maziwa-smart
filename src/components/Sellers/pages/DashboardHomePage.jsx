// ============================================================================
// FILE: /src/components/sellerdashboard/pages/DashboardHomePage.jsx
// ============================================================================
import React from 'react';
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';

const DashboardHomePage = () => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-2 fw-bold" style={{ color: '#0f172a', fontSize: '1.75rem' }}>
          Dashboard Overview
        </h2>
        <p className="mb-0" style={{ color: '#64748b', fontSize: '0.9375rem' }}>
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="bg-white p-4 rounded-3 border-0 shadow-sm h-100">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <div>
                <p className="mb-1 small" style={{ color: '#64748b' }}>Total Revenue</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>$0.00</h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: '#dcfce7',
                  color: '#10b981'
                }}
              >
                <DollarSign size={24} />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <TrendingUp size={14} style={{ color: '#10b981' }} className="me-1" />
              <small style={{ color: '#10b981', fontWeight: 600 }}>Connect your data</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="bg-white p-4 rounded-3 border-0 shadow-sm h-100">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <div>
                <p className="mb-1 small" style={{ color: '#64748b' }}>Total Orders</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>0</h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: '#dbeafe',
                  color: '#3b82f6'
                }}
              >
                <ShoppingCart size={24} />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <TrendingUp size={14} style={{ color: '#3b82f6' }} className="me-1" />
              <small style={{ color: '#3b82f6', fontWeight: 600 }}>Connect your data</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="bg-white p-4 rounded-3 border-0 shadow-sm h-100">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <div>
                <p className="mb-1 small" style={{ color: '#64748b' }}>Total Products</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>0</h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: '#fef3c7',
                  color: '#f59e0b'
                }}
              >
                <Package size={24} />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <TrendingUp size={14} style={{ color: '#f59e0b' }} className="me-1" />
              <small style={{ color: '#f59e0b', fontWeight: 600 }}>Connect your data</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="bg-white p-4 rounded-3 border-0 shadow-sm h-100">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <div>
                <p className="mb-1 small" style={{ color: '#64748b' }}>Conversion Rate</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>0%</h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: '#e0e7ff',
                  color: '#6366f1'
                }}
              >
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <TrendingUp size={14} style={{ color: '#6366f1' }} className="me-1" />
              <small style={{ color: '#6366f1', fontWeight: 600 }}>Connect your data</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="bg-white rounded-3 border-0 shadow-sm overflow-hidden">
            <div className="p-4 border-bottom" style={{ borderColor: '#e2e8f0' }}>
              <h5 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>Recent Activity</h5>
            </div>
            <div className="p-5 text-center">
              <p style={{ color: '#64748b' }}>No activity yet. Start by adding products or processing orders.</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-white rounded-3 border-0 shadow-sm overflow-hidden">
            <div className="p-4 border-bottom" style={{ borderColor: '#e2e8f0' }}>
              <h5 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>Quick Actions</h5>
            </div>
            <div className="p-4">
              <div className="d-grid gap-3">
                <button 
                  className="btn btn-lg text-start d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    fontWeight: 600
                  }}
                >
                  <span>Add New Product</span>
                  <Package size={20} />
                </button>
                <button 
                  className="btn btn-lg text-start d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    fontWeight: 600
                  }}
                >
                  <span>View Orders</span>
                  <ShoppingCart size={20} />
                </button>
                <button 
                  className="btn btn-lg text-start d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    fontWeight: 600
                  }}
                >
                  <span>View Analytics</span>
                  <TrendingUp size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
