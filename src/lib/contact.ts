// Single source for contact details used across the site.
// TODO(contact): confirm the WhatsApp number (VMH used both 919734437070 and 919374437070)
// and make sure the mailbox exists before deploy.
export const CAL_LINK = "dhrumil-sanghvi/15min";
export const CAL_NAMESPACE = "15min";
export const WHATSAPP_URL = "https://wa.me/919734437070";
export const EMAIL = "dhrumil@vertextechhouse.com";

// Spread onto any element to open the Cal.com booking popup.
export const calTrigger = {
  "data-cal-link": CAL_LINK,
  "data-cal-namespace": CAL_NAMESPACE,
  "data-cal-config": '{"layout":"month_view"}',
};
