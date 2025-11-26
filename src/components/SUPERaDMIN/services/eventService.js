
// ============================================
// FILE: /src/superadmin/services/eventService.js
// ============================================
import { apiRequest } from '../utils/api';

export const eventService = {
  getEvents: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/events?${query}`, {}, `events.${query}`);
  },

  getEvent: (id) => 
    apiRequest(`/admin/events/${id}`, {}, `event.${id}`)
};