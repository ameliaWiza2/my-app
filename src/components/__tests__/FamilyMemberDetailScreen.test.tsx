import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { FamilyMemberDetailScreen } from '../family/FamilyMemberDetailScreen';
import * as family from '../../services/family';

jest.mock('../../services/family');

const mockFamily: family.Family = {
  id: 'fam-1',
  name: 'Doe Family',
  members: [],
};

const member: family.FamilyMember = { id: 'u2', name: 'Bob', email: 'bob@example.com', role: 'viewer' };

const mockMembers: family.FamilyMember[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
  member,
];

describe('FamilyMemberDetailScreen', () => {
  const svc = family as jest.Mocked<typeof family>;
  beforeEach(() => {
    jest.resetAllMocks();
    svc.getFamily.mockResolvedValue(mockFamily);
    svc.listMembers.mockResolvedValue(mockMembers);
    svc.updateMemberRole.mockResolvedValue({ ...member, role: 'editor' });
    svc.removeMember.mockResolvedValue();
  });

  it('updates role and removes member', async () => {
    render(<FamilyMemberDetailScreen member={member} />);

    await waitFor(() => screen.getByText('Member detail'));

    const setEditorBtn = screen.getByText('Set Editor');
    fireEvent.press(setEditorBtn);

    await waitFor(() => expect(svc.updateMemberRole).toHaveBeenCalledWith('fam-1', 'u2', 'editor'));

    const removeBtn = screen.getByText('Remove from family');
    fireEvent.press(removeBtn);

    await waitFor(() => expect(svc.removeMember).toHaveBeenCalledWith('fam-1', 'u2'));
  });
});
