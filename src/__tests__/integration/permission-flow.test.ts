import {
  checkPermission,
  requestPermission,
  requestPermissionWithRationale,
} from '../../utils/permissions';
import { RESULTS } from 'react-native-permissions';

describe('Permission Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle permission request flow when granted', async () => {
    const status = await checkPermission('CAMERA');
    expect(status).toBe('granted');
  });

  it('should handle permission request with rationale', async () => {
    const mockShowRationale = jest.fn().mockResolvedValue(true);

    const result = await requestPermissionWithRationale('CAMERA', mockShowRationale);

    expect(result).toBe('granted');
  });

  it('should not request permission when rationale is declined', async () => {
    const mockShowRationale = jest.fn().mockResolvedValue(false);

    const result = await requestPermissionWithRationale('LOCATION', mockShowRationale);

    expect(result).toBe('denied');
  });

  it('should handle multiple permission checks', async () => {
    const cameraStatus = await checkPermission('CAMERA');
    const locationStatus = await checkPermission('LOCATION');
    const photoStatus = await checkPermission('PHOTO_LIBRARY');

    expect(cameraStatus).toBe('granted');
    expect(locationStatus).toBe('granted');
    expect(photoStatus).toBe('granted');
  });
});
