/**
 * Detect if user is on mobile device
 */
export const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

/**
 * Get browser's country code from locale
 */
export const getBrowserCountryCode = () => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const region = locale.split("-")[1];
    return region ? region.toUpperCase() : "KE";
  } catch {
    return "KE";
  }
};