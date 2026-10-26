import { render, screen } from '@testing-library/react';
import App from '../app/App.jsx';

test('renders board title', () => {
  render(<App />);
  expect(screen.getByText(/Team Workflow Board/i)).toBeInTheDocument();
});

test('renders all columns', () => {
  render(<App />);
  expect(screen.getByText(/To Do/i)).toBeInTheDocument();
  expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
  expect(screen.getByText(/Done/i)).toBeInTheDocument();
});