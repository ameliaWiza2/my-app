describe('Smoke Tests', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES', camera: 'YES', location: 'always' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should launch app successfully', async () => {
    await expect(element(by.id('app-container'))).toBeVisible();
  });

  it('should display main screen', async () => {
    await expect(element(by.id('main-screen'))).toBeVisible();
  });

  it('should handle permission request flow', async () => {
    await element(by.id('request-camera-permission')).tap();
    await expect(element(by.text('Camera Permission'))).toBeVisible();
    await element(by.text('Grant Access')).tap();
  });

  it('should navigate through app', async () => {
    await element(by.id('settings-button')).tap();
    await expect(element(by.id('settings-screen'))).toBeVisible();
    await element(by.id('back-button')).tap();
    await expect(element(by.id('main-screen'))).toBeVisible();
  });

  it('should display privacy policy link', async () => {
    await element(by.id('settings-button')).tap();
    await expect(element(by.text('Privacy Policy'))).toBeVisible();
  });

  it('should handle app backgrounding and foregrounding', async () => {
    await device.sendToHome();
    await device.launchApp({ newInstance: false });
    await expect(element(by.id('app-container'))).toBeVisible();
  });

  it('should support accessibility features', async () => {
    await element(by.id('test-button')).tap();
    await expect(element(by.id('test-button'))).toHaveLabel('Test Button');
  });
});
