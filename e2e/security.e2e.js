describe('Security E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should enforce HTTPS for API calls', async () => {
    await element(by.id('make-api-call')).tap();
    await expect(element(by.text('Request to insecure or unauthorized URL blocked'))).not.toExist();
  });

  it('should securely store authentication tokens', async () => {
    await element(by.id('login-button')).tap();
    await element(by.id('username-input')).typeText('testuser');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('submit-login')).tap();

    await device.sendToHome();
    await device.launchApp({ newInstance: false });

    await expect(element(by.id('logged-in-indicator'))).toBeVisible();
  });

  it('should handle unauthorized access properly', async () => {
    await element(by.id('protected-resource')).tap();
    await expect(element(by.text('Unauthorized access'))).toBeVisible();
  });

  it('should sanitize user input', async () => {
    await element(by.id('input-field')).typeText('<script>alert("xss")</script>');
    await element(by.id('submit-button')).tap();
    await expect(element(by.id('sanitized-output'))).toHaveText('scriptalert("xss")/script');
  });
});
