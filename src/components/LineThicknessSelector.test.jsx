import { render, fireEvent, screen } from '@testing-library/react';
import LineThicknessSelector from './LineThicknessSelector';

test('LineThicknessSelector calls onChange when a thickness is selected', () => {
  const onChange = jest.fn();
  render(<LineThicknessSelector value={7} onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('Thick'));
  expect(onChange).toHaveBeenCalledWith(9);
});
