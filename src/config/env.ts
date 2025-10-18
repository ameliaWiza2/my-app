import Config from 'react-native-config';

export type Environment = 'development' | 'staging' | 'production';

export type AppConfig = {
  API_URL: string;
  ENVIRONMENT: Environment;
  USE_MOCKS: boolean;
  ANALYTICS_ENABLED: boolean;
};

const normalizeBoolean = (value?: string, defaultValue = false) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
};

const environment = (Config.ENVIRONMENT as Environment) ?? 'development';

const cachedConfig: AppConfig = {
  API_URL: Config.API_URL ?? 'https://example.com/api',
  ENVIRONMENT: environment,
  USE_MOCKS: normalizeBoolean(Config.USE_MOCKS, environment !== 'production'),
  ANALYTICS_ENABLED: normalizeBoolean(Config.ANALYTICS_ENABLED, true),
};

export const getConfig = (): AppConfig => cachedConfig;
