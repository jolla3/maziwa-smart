// ============================================
// FILE: /src/superadmin/services/alertService.js
// ============================================
import { apiRequest } from '../utils/api';

export const alertService = {
  getAlerts: (status = 'open') => 
    apiRequest(`/admin/alerts?status=${status}`, {}, `alerts.${status}`),

  getAlert: (id) => 
    apiRequest(`/admin/alerts/${id}`, {}, `alert.${id}`),

  updateAlert: (id, payload) => 
    apiRequest(`/admin/alerts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),

  deleteAlert: (id) => 
    apiRequest(`/admin/alerts/${id}`, { method: 'DELETE' })
};