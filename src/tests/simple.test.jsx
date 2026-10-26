import { render, screen } from '@testing-library/react';

test('simple test passes', () => {
  render(<div>Test</div>);
  expect(screen.getByText('Test')).toBeInTheDocument();
});