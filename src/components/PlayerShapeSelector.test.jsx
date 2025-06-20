import { render, fireEvent, screen } from '@testing-library/react';
import PlayerShapeSelector from './PlayerShapeSelector';

test('PlayerShapeSelector calls onChange when a shape is selected', () => {
  const onChange = jest.fn();
  render(<PlayerShapeSelector value="circle" onChange={onChange} />);
  fireEvent.click(screen.getByLabelText('square'));
  expect(onChange).toHaveBeenCalledWith('square');
});
