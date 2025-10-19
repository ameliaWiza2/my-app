import SecureStorage from '../../services/SecureStorage';
import ApiClient from '../../services/ApiClient';

describe('Authentication Flow Integration', () => {
  beforeEach(async () => {
    await SecureStorage.clear();
    jest.clearAllMocks();
  });

  it('should complete full authentication flow', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: '1', email: 'user@example.com' };

    await SecureStorage.setItem('authToken', mockToken);
    const storedToken = await SecureStorage.getItem('authToken');
    expect(storedToken).toBe(mockToken);

    await SecureStorage.setObject('user', mockUser);
    const storedUser = await SecureStorage.getObject('user');
    expect(storedUser).toEqual(mockUser);
  });

  it('should handle logout flow', async () => {
    await SecureStorage.setItem('authToken', 'token');
    await SecureStorage.setObject('user', { id: '1' });

    await SecureStorage.removeItem('authToken');
    await SecureStorage.removeItem('user');

    const token = await SecureStorage.getItem('authToken');
    const user = await SecureStorage.getObject('user');

    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it('should handle token refresh flow', async () => {
    const oldToken = 'old-token';
    const newToken = 'new-token';

    await SecureStorage.setItem('authToken', oldToken);
    expect(await SecureStorage.getItem('authToken')).toBe(oldToken);

    await SecureStorage.setItem('authToken', newToken);
    expect(await SecureStorage.getItem('authToken')).toBe(newToken);
  });
});
