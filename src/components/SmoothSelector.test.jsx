import { render, fireEvent, screen } from '@testing-library/react';
import SmoothSelector from './SmoothSelector';

test('SmoothSelector calls onChange when an option is selected', () => {
  const onChange = jest.fn();
  render(<SmoothSelector value={false} onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('Curved'));
  expect(onChange).toHaveBeenCalledWith(true);
});
