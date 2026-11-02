// Nomz is a separate padel platform (not run by Lowveld Padel). Set VITE_NOMZ_URL
// at build time once its address is final; the promo is hidden until then.
export const NOMZ_URL = (import.meta.env.VITE_NOMZ_URL || '').replace(/\/$/, '');
