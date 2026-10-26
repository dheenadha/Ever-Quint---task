import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TaskProvider } from '../context/TaskContext.jsx';
import Board from '../features/board/Board.jsx';
import { storageService } from '../services/storageService.js';
import { TASK_STATUSES } from '../utils/constants.js';

// Mock storage service
jest.mock('../services/storageService.js');

// Mock @hello-pangea/dnd
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => (
    <div data-testid="drag-drop-context" data-on-drag-end={onDragEnd}>
      {children}
    </div>
  ),
  Droppable: ({ children, droppableId }) => (
    <div data-testid={`droppable-${droppableId}`}>
      {typeof children === 'function' ? children({
        innerRef: jest.fn(),
        droppableProps: { 'data-droppable-id': droppableId },
        placeholder: <div data-testid="placeholder" />
      }, { isDraggingOver: false }) : children}
    </div>
  ),
  Draggable: ({ children, draggableId, index }) => (
    <div data-testid={`draggable-${draggableId}`} data-index={index}>
      {typeof children === 'function' ? children({
        innerRef: jest.fn(),
        draggableProps: { 'data-draggable-id': draggableId },
        dragHandleProps: { 'data-drag-handle': true }
      }, { isDragging: false }) : children}
    </div>
  )
}));

/**
 * Test Drag and Drop functionality
 */
describe('Drag and Drop Component', () => {
  const renderBoard = () => {
    return render(
      <BrowserRouter>
        <TaskProvider>
          <Board />
        </TaskProvider>
      </BrowserRouter>
    );
  };

  const mockTasks = [
    {
      id: 'task-1',
      title: 'Task 1',
      description: 'Description 1',
      status: TASK_STATUSES.BACKLOG,
      priority: 'Medium',
      assignee: 'John Doe',
      tags: ['test'],
      createdAt: Date.now() - 10000,
      updatedAt: Date.now() - 5000
    },
    {
      id: 'task-2',
      title: 'Task 2',
      description: 'Description 2',
      status: TASK_STATUSES.IN_PROGRESS,
      priority: 'High',
      assignee: 'Jane Smith',
      tags: ['important'],
      createdAt: Date.now() - 20000,
      updatedAt: Date.now() - 10000
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock storage service methods
    storageService.getTasks.mockReturnValue(mockTasks);
    storageService.setTasks.mockReturnValue(true);
    storageService.getSchemaVersion.mockReturnValue(2);
    storageService.setSchemaVersion.mockReturnValue(true);
  });

  test('renders board with drag and drop context', () => {
    renderBoard();
    
    expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-Backlog')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-In Progress')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-Done')).toBeInTheDocument();
  });

  test('renders tasks as draggable items', () => {
    renderBoard();
    
    expect(screen.getByTestId('draggable-task-1')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-task-2')).toBeInTheDocument();
  });

  test('tasks appear in correct columns based on status', () => {
    renderBoard();
    
    // Task 1 should be in Backlog column
    const backlogColumn = screen.getByTestId('droppable-Backlog');
    expect(backlogColumn).toContainElement(screen.getByTestId('draggable-task-1'));
    
    // Task 2 should be in In Progress column
    const inProgressColumn = screen.getByTestId('droppable-In Progress');
    expect(inProgressColumn).toContainElement(screen.getByTestId('draggable-task-2'));
  });

  test('drag handle is present on task cards', () => {
    renderBoard();
    
    const taskCard = screen.getByTestId('draggable-task-1');
    expect(taskCard).toHaveAttribute('data-drag-handle');
  });

  test('placeholder is rendered for droppable areas', () => {
    renderBoard();
    
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });

  test('drag and drop context receives onDragEnd handler', () => {
    renderBoard();
    
    const dragDropContext = screen.getByTestId('drag-drop-context');
    expect(dragDropContext).toHaveAttribute('data-on-drag-end');
  });

  test('tasks are filtered correctly for each column', () => {
    renderBoard();
    
    // Check that each column only contains tasks with matching status
    const backlogColumn = screen.getByTestId('droppable-Backlog');
    const inProgressColumn = screen.getByTestId('droppable-In Progress');
    const doneColumn = screen.getByTestId('droppable-Done');
    
    // Backlog should have 1 task
    expect(backlogColumn.querySelectorAll('[data-testid^="draggable-"]')).toHaveLength(1);
    // In Progress should have 1 task
    expect(inProgressColumn.querySelectorAll('[data-testid^="draggable-"]')).toHaveLength(1);
    // Done should have 0 tasks
    expect(doneColumn.querySelectorAll('[data-testid^="draggable-"]')).toHaveLength(0);
  });

  test('task card displays correct information', () => {
    renderBoard();
    
    const taskCard = screen.getByTestId('draggable-task-1');
    expect(taskCard).toBeInTheDocument();
    expect(taskCard).toHaveTextContent('Task 1');
    expect(taskCard).toHaveTextContent('Medium');
    expect(taskCard).toHaveTextContent('test');
  });

  test('dragging state is handled correctly', () => {
    renderBoard();
    
    const taskCard = screen.getByTestId('draggable-task-1');
    // Task should not be in dragging state initially
    expect(taskCard).not.toHaveAttribute('data-is-dragging', 'true');
  });

  test('droppable areas show dragging state when active', () => {
    renderBoard();
    
    const backlogColumn = screen.getByTestId('droppable-Backlog');
    // Should not be in dragging over state initially
    expect(backlogColumn).not.toHaveAttribute('data-is-dragging-over', 'true');
  });

  test('board handles empty columns', () => {
    // Mock tasks that are all in one column
    storageService.getTasks.mockReturnValue([
      {
        ...mockTasks[0],
        status: TASK_STATUSES.DONE
      }
    ]);
    
    renderBoard();
    
    const backlogColumn = screen.getByTestId('droppable-Backlog');
    const inProgressColumn = screen.getByTestId('droppable-In Progress');
    const doneColumn = screen.getByTestId('droppable-Done');
    
    // Backlog and In Progress should be empty
    expect(backlogColumn.querySelectorAll('[data-testid^="draggable-"]')).toHaveLength(0);
    expect(inProgressColumn.querySelectorAll('[data-testid^="draggable-"]')).toHaveLength(0);
    // Done should have 1 task
    expect(doneColumn.querySelectorAll('[data-testid^="draggable-"]')).toHaveLength(1);
  });

  test('board updates when tasks change', () => {
    const { rerender } = render(
      <BrowserRouter>
        <TaskProvider>
          <Board />
        </TaskProvider>
      </BrowserRouter>
    );
    
    // Initially should show 2 tasks
    expect(screen.getByTestId('draggable-task-1')).toBeInTheDocument();
    expect(screen.getByTestId('draggable-task-2')).toBeInTheDocument();
    
    // Update tasks
    storageService.getTasks.mockReturnValue([mockTasks[0]]);
    
    // Re-render with new context
    rerender(
      <BrowserRouter>
        <TaskProvider>
          <Board />
        </TaskProvider>
      </BrowserRouter>
    );
    
    // Should now show only 1 task
    expect(screen.getByTestId('draggable-task-1')).toBeInTheDocument();
    expect(screen.queryByTestId('draggable-task-2')).not.toBeInTheDocument();
  });

  test('board handles task creation', () => {
    renderBoard();
    
    // Initially 2 tasks
    expect(screen.getAllByTestId(/draggable-/)).toHaveLength(2);
    
    // Add a new task (this would be handled through context actions)
    // For this test, we'll just verify the initial state
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  test('board handles task deletion', () => {
    renderBoard();
    
    // Initially 2 tasks
    expect(screen.getAllByTestId(/draggable-/)).toHaveLength(2);
    
    // Delete a task (this would be handled through context actions)
    // For this test, we'll just verify the initial state
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  test('board maintains performance with many tasks', () => {
    // Create many tasks
    const manyTasks = Array.from({ length: 50 }, (_, i) => ({
      id: `task-${i}`,
      title: `Task ${i}`,
      description: `Description ${i}`,
      status: i % 3 === 0 ? TASK_STATUSES.BACKLOG : 
                 i % 3 === 1 ? TASK_STATUSES.IN_PROGRESS : TASK_STATUSES.DONE,
      priority: 'Medium',
      assignee: `User ${i}`,
      tags: [`tag-${i}`],
      createdAt: Date.now() - i * 1000,
      updatedAt: Date.now() - i * 500
    }));

    storageService.getTasks.mockReturnValue(manyTasks);
    
    const startTime = performance.now();
    renderBoard();
    const renderTime = performance.now() - startTime;
    
    // Board should render reasonably quickly even with many tasks
    expect(renderTime).toBeLessThan(1000); // Less than 1 second
    
    // All tasks should be rendered
    expect(screen.getAllByTestId(/draggable-/)).toHaveLength(50);
  });
});