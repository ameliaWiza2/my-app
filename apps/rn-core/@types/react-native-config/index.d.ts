declare module 'react-native-config' {
  interface NativeConfig {
    API_URL?: string;
    ENVIRONMENT?: 'development' | 'staging' | 'production';
    USE_MOCKS?: string;
    ANALYTICS_ENABLED?: string;
  }

  const Config: NativeConfig;
  export default Config;
}
