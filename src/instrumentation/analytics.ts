import {getConfig} from '../config/env';

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

const config = getConfig();

const isEnabled = config.ANALYTICS_ENABLED !== false;

const trackConsole = ({name, properties}: AnalyticsEvent) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${name}`, properties ?? {});
  }
};

export const analytics = {
  trackEvent: (name: string, properties?: Record<string, unknown>) => {
    if (!isEnabled) {
      return;
    }
    trackConsole({name, properties});
    // Integrate vendor SDK here (e.g., Segment, Amplitude)
  },
  trackScreen: (screenName: string, properties?: Record<string, unknown>) => {
    if (!isEnabled) {
      return;
    }
    trackConsole({name: `screen:${screenName}`, properties});
  },
};
