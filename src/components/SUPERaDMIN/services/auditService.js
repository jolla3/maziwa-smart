// ============================================
// FILE: /src/superadmin/services/auditService.js
// ============================================
import { apiRequest } from '../utils/api';

export const auditService = {
  getAudit: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/audit?${query}`, {}, `audit.${query}`);
  },

  getAuditById: (id) => 
    apiRequest(`/admin/audit/${id}`, {}, `audit.${id}`)
};
