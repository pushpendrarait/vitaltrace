// VitalTrace Utility Helpers

export const formatAadhaar = (val) => {
  if (!val) return "";
  const cleaned = val.replace(/\D/g, "").slice(0, 12);
  const parts = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.slice(i, i + 4));
  }
  return parts.join(" ");
};

export const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return "XXXX XXXX XXXX";
  const cleaned = aadhaar.replace(/\s+/g, "");
  if (cleaned.length < 12) return aadhaar;
  return `XXXX XXXX ${cleaned.slice(8)}`;
};

export const isValidAadhaar = (val) => {
  if (!val) return false;
  const cleaned = val.replace(/\s+/g, "");
  return cleaned.length === 12 && /^\d{12}$/.test(cleaned);
};

export const calculateAge = (dobString) => {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const isUnder18 = (dobString) => {
  if (!dobString) return false;
  return calculateAge(dobString) < 18;
};

export const generateVitalTraceId = () => {
  const seg1 = Math.floor(1000 + Math.random() * 9000);
  const seg2 = Math.floor(1000 + Math.random() * 9000);
  const seg3 = Math.floor(1000 + Math.random() * 9000);
  return `VT-IND-${seg1}-${seg2}-${seg3}`;
};

export const formatCurrencyINR = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  if (typeof amount === "string" && isNaN(Number(amount))) return amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
};

