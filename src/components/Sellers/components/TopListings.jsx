import React from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { formatNumber, getRoleColor, getRoleBgColor } from '../utils/formatters';

const TopListings = ({ listings, loading }) => {
  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="p-5 text-center">
        <p style={{ color: '#64748b' }}>No listings with views yet</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      {listings.map((listing, index) => {
        const topRole = listing.by_role 
          ? Object.entries(listing.by_role).sort((a, b) => b[1] - a[1])[0]
          : null;

        return (
          <div 
            key={listing.listing_id} 
            className="d-flex align-items-center gap-3 p-3 mb-2 rounded"
            style={{ 
              backgroundColor: '#f8fafc',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            {/* Rank Badge */}
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: index === 0 ? '#fef3c7' : index === 1 ? '#e0e7ff' : '#dbeafe',
                color: index === 0 ? '#f59e0b' : index === 1 ? '#6366f1' : '#3b82f6',
                fontSize: '0.9rem'
              }}
            >
              #{index + 1}
            </div>

            {/* Listing Image */}
            {listing.image && (
              <img 
                src={listing.image} 
                alt={listing.title}
                className="rounded"
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
            )}

            {/* Listing Info */}
            <div className="flex-grow-1 min-w-0">
              <p className="mb-1 fw-semibold text-truncate" style={{ color: '#0f172a' }}>
                {listing.title || `Listing ${listing.listing_id.substring(0, 8)}`}
              </p>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {listing.price && (
                  <span className="badge bg-success">
                    KSh {listing.price.toLocaleString()}
                  </span>
                )}
                {topRole && (
                  <span 
                    className="badge"
                    style={{ 
                      backgroundColor: getRoleBgColor(topRole[0]),
                      color: getRoleColor(topRole[0]),
                      textTransform: 'capitalize'
                    }}
                  >
                    Most: {topRole[0]} ({topRole[1]})
                  </span>
                )}
              </div>
            </div>

            {/* Views Count */}
            <div className="text-end flex-shrink-0">
              <div className="d-flex align-items-center gap-1 justify-content-end">
                <Eye size={18} style={{ color: '#3b82f6' }} />
                <span className="fw-bold" style={{ color: '#0f172a', fontSize: '1.1rem' }}>
                  {formatNumber(listing.total_views)}
                </span>
              </div>
              <small style={{ color: '#64748b' }}>views</small>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopListings;