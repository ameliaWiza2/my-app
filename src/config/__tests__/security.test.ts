import { validateURL, sanitizeInput } from '../security';

describe('Security Utils', () => {
  describe('validateURL', () => {
    it('should reject non-HTTPS URLs', () => {
      expect(validateURL('http://api.example.com')).toBe(false);
    });

    it('should accept HTTPS URLs from allowed domains', () => {
      expect(validateURL('https://api.example.com/endpoint')).toBe(true);
    });

    it('should accept HTTPS URLs from subdomains of allowed domains', () => {
      expect(validateURL('https://subdomain.api.example.com/endpoint')).toBe(true);
    });

    it('should reject HTTPS URLs from non-allowed domains', () => {
      expect(validateURL('https://evil.com/endpoint')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(validateURL('not-a-url')).toBe(false);
    });

    it('should reject empty URLs', () => {
      expect(validateURL('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });

    it('should handle normal input', () => {
      expect(sanitizeInput('normal text')).toBe('normal text');
    });

    it('should remove angle brackets', () => {
      expect(sanitizeInput('test <> content')).toBe('test  content');
    });
  });
});
