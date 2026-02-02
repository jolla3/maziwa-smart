export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatPercentage = (value, total) => {
  if (!total) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};

export const getRoleColor = (role) => {
  const colors = {
    farmer: '#10b981',
    buyer: '#3b82f6',
    seller: '#f59e0b',
    admin: '#ef4444',
    manager: '#8b5cf6'
  };
  return colors[role] || '#64748b';
};

export const getRoleBgColor = (role) => {
  const colors = {
    farmer: '#dcfce7',
    buyer: '#dbeafe',
    seller: '#fef3c7',
    admin: '#fee2e2',
    manager: '#ede9fe'
  };
  return colors[role] || '#f1f5f9';
};