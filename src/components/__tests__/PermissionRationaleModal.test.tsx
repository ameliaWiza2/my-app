import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PermissionRationaleModal } from '../PermissionRationaleModal';
import { PermissionConfigs } from '../../utils/permissions';

describe('PermissionRationaleModal', () => {
  const mockConfig = PermissionConfigs.CAMERA;
  const mockOnAccept = jest.fn();
  const mockOnDecline = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when visible', () => {
    const { getByText } = render(
      <PermissionRationaleModal
        visible={true}
        config={mockConfig}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    expect(getByText(mockConfig.title)).toBeTruthy();
    expect(getByText(mockConfig.message)).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(
      <PermissionRationaleModal
        visible={false}
        config={mockConfig}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    expect(queryByText(mockConfig.title)).toBeNull();
  });

  it('should call onAccept when accept button is pressed', () => {
    const { getByText } = render(
      <PermissionRationaleModal
        visible={true}
        config={mockConfig}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    fireEvent.press(getByText('Grant Access'));
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  it('should call onDecline when decline button is pressed', () => {
    const { getByText } = render(
      <PermissionRationaleModal
        visible={true}
        config={mockConfig}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockOnDecline).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility labels', () => {
    const { getByLabelText } = render(
      <PermissionRationaleModal
        visible={true}
        config={mockConfig}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );

    expect(getByLabelText('Permission request dialog')).toBeTruthy();
    expect(getByLabelText(mockConfig.title)).toBeTruthy();
    expect(getByLabelText(mockConfig.message)).toBeTruthy();
  });
});
