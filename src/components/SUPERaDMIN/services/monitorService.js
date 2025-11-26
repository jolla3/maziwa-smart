// ============================================
// FILE: /src/superadmin/services/monitorService.js
// ============================================
import { apiRequest } from '../utils/api';

export const monitorService = {
  getOnlineUsers: () => 
    apiRequest('/admin/monitor/online-users', {}, 'monitor.onlineUsers'),

  getStats: () => 
    apiRequest('/admin/monitor/stats', {}, 'monitor.stats')
};
