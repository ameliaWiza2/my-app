export const SecurityConfig = {
  api: {
    enforceHTTPS: true,
    allowedDomains: ['api.example.com', 'staging-api.example.com'],
    timeout: 30000,
    maxRetries: 3,
  },
  storage: {
    encryptionEnabled: true,
    keychain: {
      service: 'com.mobileapp.secure',
      accessible: 'AccessibleWhenUnlocked',
    },
  },
  networking: {
    certificatePinning: {
      enabled: true,
      certificates: [],
    },
    allowInsecureHTTP: false,
  },
  authentication: {
    tokenExpiry: 3600,
    refreshThreshold: 300,
    biometricEnabled: true,
  },
};

export const validateURL = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObject = new URL(url);

    if (SecurityConfig.api.enforceHTTPS && urlObject.protocol !== 'https:') {
      console.error('Non-HTTPS URL detected:', url);
      return false;
    }

    const domain = urlObject.hostname;
    const isAllowedDomain = SecurityConfig.api.allowedDomains.some(
      allowedDomain => domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
    );

    if (!isAllowedDomain) {
      console.warn('URL domain not in allowed list:', domain);
    }

    return isAllowedDomain;
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};
