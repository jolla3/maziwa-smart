import { useCallback } from "react";
import { getUserPhone, normalizePhoneE164, getWhatsAppNumber } from "../utils/phone";
import { isMobileDevice } from "../utils/device";

export const useCallHandler = (counterpart) => {
  const handleVoiceCall = useCallback(() => {
    const rawPhone = getUserPhone(counterpart);
    const phone = normalizePhoneE164(rawPhone);

    if (!phone) {
      alert("Phone number not available for this user.");
      return;
    }

    window.open(`tel:${phone}`);
  }, [counterpart]);

  const handleWhatsAppChat = useCallback(() => {
    const rawPhone = getUserPhone(counterpart);
    const waNumber = getWhatsAppNumber(rawPhone);

    if (!waNumber) {
      alert("WhatsApp number not available for this user.");
      return;
    }

    const url = isMobileDevice()
      ? `whatsapp://send?phone=${waNumber}`
      : `https://wa.me/${waNumber}`;

    window.open(url, "_blank");
  }, [counterpart]);

  return { handleVoiceCall, handleWhatsAppChat };
};