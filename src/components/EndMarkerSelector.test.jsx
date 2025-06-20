import { render, fireEvent, screen } from '@testing-library/react';
import EndMarkerSelector from './EndMarkerSelector';

test('EndMarkerSelector calls onChange when a marker is selected', () => {
  const onChange = jest.fn();
  render(<EndMarkerSelector value="arrow" onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('dot'));
  expect(onChange).toHaveBeenCalledWith('dot');
});
