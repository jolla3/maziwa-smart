/**
 * Format ISO timestamp to readable time
 */
export const formatTime = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    
    if (isToday) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + 
           " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (err) {
    return "";
  }
};

/**
 * Format last seen timestamp
 */
export const formatLastSeen = (date) => {
  if (!date) return "Offline";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Offline";
    
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Active now";
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    return `Last seen ${d.toLocaleDateString()}`;
  } catch (err) {
    return "Offline";
  }
};

/**
 * Format date for message grouping
 */
export const formatMessageDate = (iso) => {
  try {
    const msgDate = new Date(iso);
    if (isNaN(msgDate.getTime())) return "";
    return msgDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};