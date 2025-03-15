import posthog from 'posthog-js';

// Function to identify a user in PostHog when they log in
export const identifyUser = (userId: string, nickname: string) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, {
      nickname,
    });
  }
};

// Function to reset user identity when logging out
export const resetIdentity = () => {
  if (typeof window !== 'undefined') {
    posthog.reset();
  }
};

// Utility to track custom events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};
