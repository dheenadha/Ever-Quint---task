import { render, screen, fireEvent } from '@testing-library/react';
import { useFilters } from '../hooks/useFilters';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams(), jest.fn()]
}));

const TestComponent = ({ tasks }) => {
  const { 
    filteredTasks, 
    setStatusFilter, 
    setPriorityFilter, 
    setSearchFilter 
  } = useFilters(tasks);

  return (
    <div>
      <div data-testid="task-count">{filteredTasks.length}</div>
      <button onClick={() => setStatusFilter(['todo'])}>Filter Todo</button>
      <button onClick={() => setPriorityFilter(['high'])}>Filter High</button>
      <button onClick={() => setSearchFilter('test')}>Search Test</button>
    </div>
  );
};

test('filters tasks correctly', () => {
  const tasks = [
    { id: 1, title: 'Test Task', status: 'todo', priority: 'high' },
    { id: 2, title: 'Another Task', status: 'in_progress', priority: 'medium' }
  ];

  render(<TestComponent tasks={tasks} />);
  
  expect(screen.getByTestId('task-count')).toHaveTextContent('2');
});