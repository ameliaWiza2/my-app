import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { FamilyListScreen } from '../family/FamilyListScreen';
import * as family from '../../services/family';

jest.mock('../../services/family');

const mockFamily: family.Family = {
  id: 'fam-1',
  name: 'Doe Family',
  members: [],
};

const mockMembers: family.FamilyMember[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', role: 'viewer' },
];

describe('FamilyListScreen', () => {
  const svc = family as jest.Mocked<typeof family>;
  beforeEach(() => {
    jest.resetAllMocks();
    svc.getFamily.mockResolvedValue(mockFamily);
    svc.listMembers.mockResolvedValue(mockMembers);
    svc.inviteMember.mockResolvedValue({ code: 'C', link: 'https://link' });
  });

  it('renders members and invites', async () => {
    render(<FamilyListScreen />);

    await waitFor(() => screen.getByText('Doe Family'));

    expect(screen.getByText('Alice')).toBeTruthy();

    const input = screen.getByPlaceholderText('Invite by email');
    fireEvent.changeText(input, 'new@example.com');

    const inviteBtn = screen.getByText('Invite');
    fireEvent.press(inviteBtn);

    await waitFor(() => expect(svc.inviteMember).toHaveBeenCalledWith('fam-1', 'new@example.com'));
  });
});
