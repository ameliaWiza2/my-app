import '@testing-library/jest-native/extend-expect';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock('react-native-gesture-handler', () => {
  const actual = jest.requireActual('react-native-gesture-handler/jestSetup');
  return actual;
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-keychain', () => {
  const storage = new Map();

  return {
    ACCESSIBLE: {
      WHEN_UNLOCKED: 'WHEN_UNLOCKED'
    },
    setGenericPassword: jest.fn((username, password, options = {}) => {
      const service = options.service ?? 'default';
      storage.set(service, {username, password});
      return Promise.resolve(true);
    }),
    getGenericPassword: jest.fn(options => {
      const service = options?.service ?? 'default';
      return Promise.resolve(storage.get(service) ?? false);
    }),
    resetGenericPassword: jest.fn(options => {
      const service = options?.service ?? 'default';
      storage.delete(service);
      return Promise.resolve(true);
    })
  };
});
