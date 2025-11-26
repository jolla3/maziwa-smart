// ============================================
// FILE: /src/superadmin/services/sessionService.js
// ============================================
import { apiRequest } from '../utils/api';

export const sessionService = {
  getSessions: () => 
    apiRequest('/admin/sessions', {}, 'sessions'),

  killSession: (id) => 
    apiRequest(`/admin/sessions/${id}`, { method: 'DELETE' })
};