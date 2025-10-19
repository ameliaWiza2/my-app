import React from 'react';
import {render} from '@testing-library/react-native';
import {PregnancyTimeline} from '../PregnancyTimeline';

describe('PregnancyTimeline', () => {
  it('displays GA and countdown based on LMP', () => {
    const now = new Date('2025-01-15T12:00:00.000Z');
    const {getByLabelText} = render(<PregnancyTimeline data={{lmpDate: '2025-01-01'}} now={now} />);
    expect(getByLabelText('Gestational age value').props.children).toContain('2w');
    expect(getByLabelText('EDD countdown value').props.children).toContain('days');
  });

  it('falls back to manual EDD when LMP missing', () => {
    const now = new Date('2025-09-10T12:00:00.000Z');
    const {getByLabelText} = render(
      <PregnancyTimeline data={{manualEDD: '2025-12-10'}} now={now} />,
    );
    const gaText = getByLabelText('Gestational age value').props.children as string;
    expect(gaText).toMatch(/\d+w \d+d/);
  });
});
