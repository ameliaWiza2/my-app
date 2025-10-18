import { checkPermission, requestPermission, PermissionConfigs } from '../permissions';
import { check, request, RESULTS } from 'react-native-permissions';

jest.mock('react-native-permissions');

describe('Permissions Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkPermission', () => {
    it('should check camera permission successfully', async () => {
      (check as jest.Mock).mockResolvedValue(RESULTS.GRANTED);

      const result = await checkPermission('CAMERA');

      expect(result).toBe('granted');
      expect(check).toHaveBeenCalledWith(PermissionConfigs.CAMERA.permission);
    });

    it('should return denied status', async () => {
      (check as jest.Mock).mockResolvedValue(RESULTS.DENIED);

      const result = await checkPermission('LOCATION');

      expect(result).toBe('denied');
    });

    it('should throw error for unknown permission type', async () => {
      await expect(checkPermission('UNKNOWN' as any)).rejects.toThrow(
        'Unknown permission type: UNKNOWN'
      );
    });
  });

  describe('requestPermission', () => {
    it('should request camera permission successfully', async () => {
      (request as jest.Mock).mockResolvedValue(RESULTS.GRANTED);

      const result = await requestPermission('CAMERA');

      expect(result).toBe('granted');
      expect(request).toHaveBeenCalledWith(PermissionConfigs.CAMERA.permission);
    });

    it('should return blocked status', async () => {
      (request as jest.Mock).mockResolvedValue(RESULTS.BLOCKED);

      const result = await requestPermission('PHOTO_LIBRARY');

      expect(result).toBe('blocked');
    });

    it('should throw error for unknown permission type', async () => {
      await expect(requestPermission('INVALID' as any)).rejects.toThrow(
        'Unknown permission type: INVALID'
      );
    });
  });
});
