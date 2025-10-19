import SecureStorage from '../SecureStorage';
import EncryptedStorage from 'react-native-encrypted-storage';

jest.mock('react-native-encrypted-storage');

describe('SecureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should store a value successfully', async () => {
      const key = 'testKey';
      const value = 'testValue';

      await SecureStorage.setItem(key, value);

      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should throw error when storage fails', async () => {
      const mockError = new Error('Storage error');
      (EncryptedStorage.setItem as jest.Mock).mockRejectedValue(mockError);

      await expect(SecureStorage.setItem('key', 'value')).rejects.toThrow(
        'Failed to store secure data'
      );
    });
  });

  describe('getItem', () => {
    it('should retrieve a value successfully', async () => {
      const key = 'testKey';
      const value = 'testValue';
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(value);

      const result = await SecureStorage.getItem(key);

      expect(result).toBe(value);
      expect(EncryptedStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should return null when retrieval fails', async () => {
      (EncryptedStorage.getItem as jest.Mock).mockRejectedValue(new Error('Retrieval error'));

      const result = await SecureStorage.getItem('key');

      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove a value successfully', async () => {
      const key = 'testKey';

      await SecureStorage.removeItem(key);

      expect(EncryptedStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe('clear', () => {
    it('should clear all storage successfully', async () => {
      await SecureStorage.clear();

      expect(EncryptedStorage.clear).toHaveBeenCalled();
    });
  });

  describe('setObject', () => {
    it('should store an object successfully', async () => {
      const key = 'testKey';
      const obj = { name: 'test', value: 123 };

      await SecureStorage.setObject(key, obj);

      expect(EncryptedStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(obj));
    });
  });

  describe('getObject', () => {
    it('should retrieve an object successfully', async () => {
      const key = 'testKey';
      const obj = { name: 'test', value: 123 };
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(obj));

      const result = await SecureStorage.getObject(key);

      expect(result).toEqual(obj);
    });

    it('should return null when no object exists', async () => {
      (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await SecureStorage.getObject('key');

      expect(result).toBeNull();
    });
  });
});
