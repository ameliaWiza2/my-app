import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@components/Button';

describe('Button', () => {
  it('should render correctly with title', () => {
    const { getByText } = render(<Button onPress={() => {}} title="Press me" />);
    expect(getByText('Press me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<Button onPress={onPressMock} title="Press me" />);

    fireEvent.press(getByTestId('button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<Button onPress={onPressMock} title="Press me" disabled />);

    fireEvent.press(getByTestId('button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId, queryByText } = render(
      <Button onPress={() => {}} title="Press me" loading />,
    );

    expect(queryByText('Press me')).toBeNull();
    expect(getByTestId('button')).toBeTruthy();
  });
});
