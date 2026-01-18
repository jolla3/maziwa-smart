import { parsePhoneNumberFromString, getCountryCallingCode } from "libphonenumber-js";

/**
 * Get phone number from user object (checks multiple fields)
 */
export const getUserPhone = (user) => {
  if (!user) return null;
  return (
    user.phone ||
    user.whatsapp ||
    user.mobile ||
    user.contact?.phone ||
    user.contact?.whatsapp ||
    null
  );
};

/**
 * Sanitize phone to digits only
 */
export const sanitizePhone = (phone) => {
  if (!phone) return null;
  const str = String(phone).replace(/\D/g, "");
  return str.length >= 7 ? str : null;
};

/**
 * Get browser's detected country code
 */
export const getBrowserCountryCode = () => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const region = locale.split("-")[1];
    if (!region) return "KE"; // fallback Kenya
    return region.toUpperCase();
  } catch {
    return "KE";
  }
};

/**
 * Get country calling code (e.g., "254" for Kenya)
 */
export const getCallingCode = (countryCode = "KE") => {
  try {
    return getCountryCallingCode(countryCode);
  } catch {
    return "254"; // fallback
  }
};

/**
 * Normalize phone to E.164 format (+2547XXXXXXXX)
 */
export const normalizePhoneE164 = (rawPhone, defaultCountry = "KE") => {
  if (!rawPhone) return null;

  const digits = String(rawPhone).replace(/\D/g, "");

  try {
    let phone;

    // Kenya-specific handling
    if (
      (digits.length === 9 && digits.startsWith("7")) ||
      (digits.length === 10 && digits.startsWith("0"))
    ) {
      phone = parsePhoneNumberFromString(digits, "KE");
    } else {
      // Try parsing as international or with default country
      phone = parsePhoneNumberFromString(rawPhone) || 
              parsePhoneNumberFromString(rawPhone, defaultCountry);
    }

    if (!phone || !phone.isValid()) return null;

    return phone.number; // Returns +2547XXXXXXXX format
  } catch {
    return null;
  }
};

/**
 * Format phone for display (with country code)
 */
export const formatPhoneDisplay = (rawPhone, defaultCountry = "KE") => {
  const e164 = normalizePhoneE164(rawPhone, defaultCountry);
  if (!e164) return rawPhone; // fallback to original

  try {
    const phone = parsePhoneNumberFromString(e164);
    return phone ? phone.formatInternational() : e164;
  } catch {
    return e164;
  }
};

/**
 * Get WhatsApp-ready phone (no + prefix)
 */
export const getWhatsAppNumber = (rawPhone, defaultCountry = "KE") => {
  const e164 = normalizePhoneE164(rawPhone, defaultCountry);
  return e164 ? e164.replace("+", "") : null;
};