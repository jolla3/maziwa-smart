// farmhome/components/MarketplaceAnalytics.jsx
import React from 'react';
import { Eye, Package, ShoppingCart, TrendingUp, Users, MessageSquare, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useListingViews from '../hooks/useListingViews';
import ViewsChart from '../../../Sellers/components/ViewsChart'; // Added import
import TopListings from '../../../Sellers/components/TopListings'; // Added import


const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const MarketplaceAnalytics = () => {
  const navigate = useNavigate();
  const { viewsData, loading, error, isStale, refresh } = useListingViews(true);

  const totalViews = viewsData?.total_views || 0;
  const totalListings = viewsData?.total_listings || 0;
  const byRole = viewsData?.by_role || {};
  const topListings = viewsData?.top_viewed || [];

  const topEngagedRole = Object.entries(byRole).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      label: 'Total Views',
      value: formatNumber(totalViews),
      icon: Eye,
      bgColor: '#dbeafe',
      iconColor: '#3b82f6',
      trend: `Across ${totalListings} listing${totalListings !== 1 ? 's' : ''}`,
      trendColor: '#3b82f6'
    },
    {
      label: 'Active Listings',
      value: totalListings,
      icon: Package,
      bgColor: '#fef3c7',
      iconColor: '#f59e0b',
      trend: 'Total products',
      trendColor: '#f59e0b'
    },
    {
      label: 'Most Engaged',
      value: topEngagedRole ? topEngagedRole[0].charAt(0).toUpperCase() + topEngagedRole[0].slice(1) : 'N/A',
      icon: Users,
      bgColor: '#dcfce7',
      iconColor: '#10b981',
      trend: topEngagedRole ? `${topEngagedRole[1]} views` : 'No data',
      trendColor: '#10b981'
    },
    {
      label: 'Avg Views/Listing',
      value: totalListings > 0 ? formatNumber(Math.round(totalViews / totalListings)) : '0',
      icon: TrendingUp,
      bgColor: '#e0e7ff',
      iconColor: '#6366f1',
      trend: 'Per product',
      trendColor: '#6366f1'
    }
  ];

  const quickActions = [
    {
      label: 'Add New Product',
      icon: Package,
      bgColor: '#10b981',
      textColor: '#ffffff',
      onClick: () => navigate('/fmr.drb/my-listings')
    },
    {
      label: 'View All Listings',
      icon: ShoppingCart,
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      border: '1px solid #e2e8f0',
      onClick: () => navigate('/fmr.drb/my-listings')
    },
    {
      label: 'Check Messages',
      icon: MessageSquare,
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      border: '1px solid #e2e8f0',
      onClick: () => navigate('/fmr.drb/recents')
    },
    {
      label: 'Browse Market',
      icon: TrendingUp,
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      border: '1px solid #e2e8f0',
      onClick: () => navigate('/fmr.drb/market')
    }
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Header */}
      <div className="mb-4 d-flex justify-content-between align-items-start">
        <div>
          <h2 className="mb-2 fw-bold" style={{ color: '#0f172a', fontSize: '2rem' }}>
            Dashboard Analytics
          </h2>
          <p className="mb-0" style={{ color: '#64748b', fontSize: '1rem' }}>
            Track who's viewing your products and optimize your listings
          </p>
        </div>
        <button
          className="btn btn-sm d-flex align-items-center gap-2"
          style={{
            backgroundColor: isStale ? '#fef3c7' : '#f0fdf4',
            color: isStale ? '#f59e0b' : '#10b981',
            border: 'none',
            fontWeight: 600
          }}
          onClick={() => refresh()}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spinner-border spinner-border-sm' : ''} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-warning mb-4" role="alert">
          <strong>Warning:</strong> {error}. Showing cached data if available.
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="col-md-6 col-lg-3">
              <div 
                className="bg-white p-4 rounded-3 border-0 shadow-sm h-100"
                style={{ transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <p className="mb-1 small" style={{ color: '#64748b', fontWeight: 500 }}>
                      {stat.label}
                    </p>
                    <h3 className="mb-0 fw-bold" style={{ color: '#0f172a', fontSize: '1.75rem' }}>
                      {stat.value}
                    </h3>
                  </div>
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{ 
                      width: '52px', 
                      height: '52px', 
                      backgroundColor: stat.bgColor,
                      color: stat.iconColor
                    }}
                  >
                    <Icon size={26} />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <small style={{ color: stat.trendColor, fontWeight: 600 }}>
                    {stat.trend}
                  </small>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Top Listings */}
        <div className="col-lg-8">
          <div className="bg-white rounded-3 border-0 shadow-sm overflow-hidden h-100">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center" 
                 style={{ borderColor: '#e2e8f0' }}>
              <h5 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>
                Top Performing Listings
              </h5>
              <button 
                className="btn btn-sm"
                style={{ 
                  backgroundColor: '#f0fdf4', 
                  color: '#10b981',
                  border: 'none',
                  fontWeight: 600
                }}
                onClick={() => navigate('/fmr.drb/my-listings')}
              >
                <Plus size={16} className="me-1" />
                Add Listing
              </button>
            </div>
            <TopListings listings={topListings} loading={loading} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Views by Role Chart */}
          <div className="bg-white rounded-3 border-0 shadow-sm overflow-hidden mb-4">
            <ViewsChart byRole={byRole} totalViews={totalViews} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3 border-0 shadow-sm overflow-hidden">
            <div className="p-4 border-bottom" style={{ borderColor: '#e2e8f0' }}>
              <h5 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>
                Quick Actions
              </h5>
            </div>
            <div className="p-4">
              <div className="d-grid gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button 
                      key={index}
                      className="btn btn-lg text-start d-flex align-items-center justify-content-between"
                      style={{
                        backgroundColor: action.bgColor,
                        color: action.textColor,
                        border: action.border || 'none',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onClick={action.onClick}
                      onMouseEnter={(e) => {
                        if (action.bgColor === '#f8fafc') {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = action.bgColor;
                      }}
                    >
                      <span>{action.label}</span>
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceAnalytics;