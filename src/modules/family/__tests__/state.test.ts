import React, { useEffect } from 'react';
import { render, act, screen } from '@testing-library/react-native';
import * as family from '../../../services/family';
import { useFamily, familyReducer, initialFamilyState } from '../state';

jest.mock('../../../services/family');

const mockFamily: family.Family = {
  id: 'fam-1',
  name: 'Doe Family',
  members: [],
};

const mockMembers: family.FamilyMember[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', role: 'viewer' },
];

describe('family reducer', () => {
  it('handles load success', () => {
    const next = familyReducer(initialFamilyState, {
      type: 'LOAD_SUCCESS',
      payload: { family: mockFamily, members: mockMembers },
    });
    expect(next.family).toEqual(mockFamily);
    expect(next.members).toEqual(mockMembers);
  });

  it('handles optimistic role update and rollback', () => {
    const startState = { ...initialFamilyState, members: mockMembers };
    const next = familyReducer(startState, { type: 'ROLE_UPDATE_START', payload: { memberId: 'u2', newRole: 'editor' } });
    expect(next.members.find(m => m.id === 'u2')?.role).toBe('editor');
    const rolled = familyReducer(next, { type: 'ROLE_UPDATE_ROLLBACK', payload: { memberId: 'u2', prevRole: 'viewer' } });
    expect(rolled.members.find(m => m.id === 'u2')?.role).toBe('viewer');
  });
});

describe('useFamily hook', () => {
  const svc = family as jest.Mocked<typeof family>;

  beforeEach(() => {
    jest.resetAllMocks();
    svc.getFamily.mockResolvedValue(mockFamily);
    svc.listMembers.mockResolvedValue(mockMembers);
    svc.inviteMember.mockResolvedValue({ code: 'CODE', link: 'https://invite' });
    svc.updateMemberRole.mockResolvedValue({ ...mockMembers[1], role: 'editor' });
    svc.removeMember.mockResolvedValue();
  });

  const HookTester: React.FC<{
    onReady: (api: ReturnType<typeof useFamily>) => void;
    run?: (api: ReturnType<typeof useFamily>) => Promise<void> | void;
  }> = ({ onReady, run }) => {
    const api = useFamily();
    useEffect(() => {
      onReady(api);
      if (run) {
        run(api);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api]);
    return null;
  };

  it('loads family and members', async () => {
    let current: ReturnType<typeof useFamily> | null = null;
    render(<HookTester onReady={api => { current = api; }} />);
    expect(current?.state.loading).toBe(true);
    await act(async () => {});
    expect(current?.state.loading).toBe(false);
    expect(current?.state.family).toEqual(mockFamily);
    expect(current?.state.members).toEqual(mockMembers);
  });

  it('invites a member', async () => {
    let current: ReturnType<typeof useFamily> | null = null;
    render(<HookTester onReady={api => { current = api; }} />);
    await act(async () => {});

    await act(async () => {
      await current?.invite('new@example.com');
    });

    expect(svc.inviteMember).toHaveBeenCalledWith('fam-1', 'new@example.com');
    expect(current?.state.inviteStatus).toBe('succeeded');
  });

  it('optimistically updates role and rolls back on failure', async () => {
    let current: ReturnType<typeof useFamily> | null = null;
    render(<HookTester onReady={api => { current = api; }} />);
    await act(async () => {});

    svc.updateMemberRole.mockRejectedValueOnce(new Error('fail'));

    await act(async () => {
      await current?.updateRole('u2', 'editor');
    });

    const m = current?.state.members.find(m => m.id === 'u2');
    expect(m?.role).toBe('viewer');
    expect(current?.state.roleUpdateStatus).toBe('failed');
  });

  it('optimistically removes and rolls back on failure', async () => {
    let current: ReturnType<typeof useFamily> | null = null;
    render(<HookTester onReady={api => { current = api; }} />);
    await act(async () => {});

    svc.removeMember.mockRejectedValueOnce(new Error('fail'));

    await act(async () => {
      await current?.remove('u2');
    });

    const ids = current?.state.members.map(m => m.id) ?? [];
    expect(ids).toContain('u2');
    expect(current?.state.removeStatus).toBe('failed');
  });
});
