
// ============================================
// FIX 4: Update context file name if needed
// Rename SuperAdminContext.jsx to AdminContext.jsx
// OR update the export in SuperAdminContext.jsx:
// ============================================

// FILE: /src/superadmin/context/SuperAdminContext.jsx (or AdminContext.jsx)
import React, { createContext, useContext } from 'react';
import { useAdminSocket } from '../hooks/useAdminSocket';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const socketData = useAdminSocket();
  return <AdminContext.Provider value={socketData}>{children}</AdminContext.Provider>;
};

// Export BOTH names so either import works
export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const useSuperAdmin = useAdmin; // Alias for compatibility

export default AdminContext;