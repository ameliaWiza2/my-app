import { getFallbackResponse } from '../aiService';

describe('AI Service', () => {
  describe('getFallbackResponse', () => {
    it('should return a helpful fallback message', () => {
      const response = getFallbackResponse();
      expect(response).toContain('unable to process');
      expect(response).toContain('emergency');
    });
  });
});
