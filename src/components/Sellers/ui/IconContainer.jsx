
// ============================================================================
// FILE: /src/components/sellerdashboard/ui/IconContainer.jsx
// ============================================================================
import React from 'react';

const IconContainer = ({ icon: Icon, size = 20, className = '' }) => {
  if (!Icon) return null;
  
  return <Icon size={size} className={className} />;
};

export default IconContainer;
