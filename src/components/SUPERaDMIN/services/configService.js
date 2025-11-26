// ============================================
// FILE: /src/superadmin/services/configService.js
// ============================================
import { apiRequest } from '../utils/api';

export const configService = {
  getConfig: () => 
    apiRequest('/admin/monitor/config', {}, 'config'),

  updateConfig: (data) => 
    apiRequest('/admin/monitor/config', {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
};