// lib/mixpanel.js
import mixpanel from 'mixpanel-browser';

export const initMixpanel = () => {
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (typeof window !== 'undefined') {
    mixpanel.track(eventName, properties);
  }
};

export const identifyUser = (userId) => {
  if (typeof window !== 'undefined') {
    mixpanel.identify(userId);
  }
};

export default mixpanel;
