import {canEditPregnancy} from '../rolePermissions';

describe('role permissions', () => {
  it('only allows Pregnant role to edit pregnancy data', () => {
    expect(canEditPregnancy('Pregnant')).toBe(true);
    expect(canEditPregnancy('Husband')).toBe(false);
    expect(canEditPregnancy('Other')).toBe(false);
  });
});
