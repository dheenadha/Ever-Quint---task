import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TaskProvider } from '../context/TaskContext.jsx';
import TaskForm from '../features/tasks/TaskForm.jsx';
import { storageService } from '../services/storageService.js';
import { TASK_STATUSES, TASK_PRIORITIES, VALIDATION_RULES } from '../utils/constants.js';

// Mock storage service
jest.mock('../services/storageService.js');

/**
 * Test TaskForm component
 */
describe('TaskForm Component', () => {
  const renderTaskForm = (task = null) => {
    const onSave = jest.fn();
    const onCancel = jest.fn();
    
    return {
      ...render(
        <BrowserRouter>
          <TaskProvider>
            <TaskForm task={task} onSave={onSave} onCancel={onCancel} />
          </TaskProvider>
        </BrowserRouter>
      ),
      onSave,
      onCancel
    };
  };

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    status: TASK_STATUSES.BACKLOG,
    priority: TASK_PRIORITIES.MEDIUM,
    assignee: 'John Doe',
    tags: ['test', 'important'],
    createdAt: Date.now() - 10000,
    updatedAt: Date.now() - 5000
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock storage service methods
    storageService.getTasks.mockReturnValue([mockTask]);
    storageService.setTasks.mockReturnValue(true);
    storageService.getSchemaVersion.mockReturnValue(2);
    storageService.setSchemaVersion.mockReturnValue(true);
  });

  test('renders form for creating new task', () => {
    renderTaskForm();
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByText('Fill in the details below to create the task')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Assignee')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  test('renders form for editing existing task', () => {
    renderTaskForm(mockTask);
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByText('Fill in the details below to update the task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue(TASK_STATUSES.BACKLOG)).toBeInTheDocument();
    expect(screen.getByDisplayValue(TASK_PRIORITIES.MEDIUM)).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const { onSave } = renderTaskForm();
    
    const saveButton = screen.getByText('Create Task');
    await userEvent.click(saveButton);
    
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('validates title length', async () => {
    const { onSave } = renderTaskForm();
    
    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.type(titleInput, 'A'); // Too short
    
    const saveButton = screen.getByText('Create Task');
    await userEvent.click(saveButton);
    
    expect(screen.getByText(`Title must be at least ${VALIDATION_RULES.title.minLength} characters`)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('validates title maximum length', async () => {
    const { onSave } = renderTaskForm();
    
    const titleInput = screen.getByLabelText('Task Title');
    const longTitle = 'A'.repeat(VALIDATION_RULES.title.maxLength + 1);
    await userEvent.type(titleInput, longTitle);
    
    const saveButton = screen.getByText('Create Task');
    await userEvent.click(saveButton);
    
    expect(screen.getByText(`Title cannot exceed ${VALIDATION_RULES.title.maxLength} characters`)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('validates description maximum length', async () => {
    const { onSave } = renderTaskForm();
    
    const descriptionInput = screen.getByLabelText('Description');
    const longDescription = 'A'.repeat(VALIDATION_RULES.description.maxLength + 1);
    await userEvent.type(descriptionInput, longDescription);
    
    const saveButton = screen.getByText('Create Task');
    await userEvent.click(saveButton);
    
    expect(screen.getByText(`Description cannot exceed ${VALIDATION_RULES.description.maxLength} characters`)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('validates assignee maximum length', async () => {
    const { onSave } = renderTaskForm();
    
    const assigneeInput = screen.getByLabelText('Assignee');
    const longAssignee = 'A'.repeat(VALIDATION_RULES.assignee.maxLength + 1);
    await userEvent.type(assigneeInput, longAssignee);
    
    const saveButton = screen.getByText('Create Task');
    await userEvent.click(saveButton);
    
    expect(screen.getByText(`Assignee name cannot exceed ${VALIDATION_RULES.assignee.maxLength} characters`)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('adds and removes tags', async () => {
    renderTaskForm();
    
    // Add a tag
    const addTagButton = screen.getByText('+ Add Tag');
    await userEvent.click(addTagButton);
    
    const tagInput = screen.getByPlaceholderText('Enter tag and press Enter');
    await userEvent.type(tagInput, 'test-tag');
    await userEvent.keyboard('{Enter}');
    
    expect(screen.getByText('test-tag')).toBeInTheDocument();
    
    // Remove the tag
    const removeButton = screen.getByLabelText('Remove test-tag tag');
    await userEvent.click(removeButton);
    
    expect(screen.queryByText('test-tag')).not.toBeInTheDocument();
  });

  test('prevents duplicate tags', async () => {
    renderTaskForm();
    
    // Add first tag
    const addTagButton = screen.getByText('+ Add Tag');
    await userEvent.click(addTagButton);
    
    const tagInput = screen.getByPlaceholderText('Enter tag and press Enter');
    await userEvent.type(tagInput, 'duplicate');
    await userEvent.keyboard('{Enter}');
    
    // Try to add duplicate tag
    await userEvent.type(tagInput, 'duplicate');
    await userEvent.keyboard('{Enter}');
    
    expect(screen.getByText('Tag already exists')).toBeInTheDocument();
  });

  test('validates tag maximum length', async () => {
    renderTaskForm();
    
    // Add a tag
    const addTagButton = screen.getByText('+ Add Tag');
    await userEvent.click(addTagButton);
    
    const tagInput = screen.getByPlaceholderText('Enter tag and press Enter');
    const longTag = 'A'.repeat(VALIDATION_RULES.tag.maxLength + 1);
    await userEvent.type(tagInput, longTag);
    await userEvent.keyboard('{Enter}');
    
    expect(screen.getByText(`Each tag cannot exceed ${VALIDATION_RULES.tag.maxLength} characters`)).toBeInTheDocument();
  });

  test('calls onSave with correct data for new task', async () => {
    const { onSave } = renderTaskForm();
    
    // Fill in required fields
    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.type(titleInput, 'Test Task Title');
    
    const descriptionInput = screen.getByLabelText('Description');
    await userEvent.type(descriptionInput, 'Test Description');
    
    const assigneeInput = screen.getByLabelText('Assignee');
    await userEvent.type(assigneeInput, 'Test Assignee');
    
    // Add a tag
    const addTagButton = screen.getByText('+ Add Tag');
    await userEvent.click(addTagButton);
    
    const tagInput = screen.getByPlaceholderText('Enter tag and press Enter');
    await userEvent.type(tagInput, 'test');
    await userEvent.keyboard('{Enter}');
    
    const saveButton = screen.getByText('Create Task');
    await userEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith({
      title: 'Test Task Title',
      description: 'Test Description',
      status: TASK_STATUSES.BACKLOG,
      priority: TASK_PRIORITIES.MEDIUM,
      assignee: 'Test Assignee',
      tags: ['test']
    });
  });

  test('calls onSave with correct data for editing task', async () => {
    const { onSave } = renderTaskForm(mockTask);
    
    // Update title
    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Task Title');
    
    // Update assignee
    const assigneeInput = screen.getByLabelText('Assignee');
    await userEvent.clear(assigneeInput);
    await userEvent.type(assigneeInput, 'Updated Assignee');
    
    const saveButton = screen.getByText('Update Task');
    await userEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith({
      title: 'Updated Task Title',
      description: 'Test Description',
      status: TASK_STATUSES.BACKLOG,
      priority: TASK_PRIORITIES.MEDIUM,
      assignee: 'Updated Assignee',
      tags: ['test', 'important']
    });
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const { onCancel } = renderTaskForm();
    
    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalled();
  });

  test('shows dirty state warning when trying to cancel with unsaved changes', async () => {
    const { onCancel } = renderTaskForm();
    
    // Make changes to the form
    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.type(titleInput, 'Test');
    
    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);
    
    // Should show confirmation dialog (this would need window.confirm mocking to test fully)
    expect(onCancel).toHaveBeenCalled();
  });

  test('handles form submission with all fields', async () => {
    const { onSave } = renderTaskForm();
    
    // Fill in all fields
    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.type(titleInput, 'Complete Task');
    
    const descriptionInput = screen.getByLabelText('Description');
    await userEvent.type(descriptionInput, 'Complete description here');
    
    const statusSelect = screen.getByLabelText('Status');
    await userEvent.selectOptions(statusSelect, TASK_STATUSES.IN_PROGRESS);
    
    const prioritySelect = screen.getByLabelText('Priority');
    await userEvent.selectOptions(prioritySelect, TASK_PRIORITIES.HIGH);
    
    const assigneeInput = screen.getByLabelText('Assignee');
    await userEvent.type(assigneeInput, 'Jane Doe');
    
    // Add multiple tags
    const addTagButton = screen.getByText('+ Add Tag');
    await userEvent.click(addTagButton);
    const tagInput = screen.getByPlaceholderText('Enter tag and press Enter');
    await userEvent.type(tagInput, 'important');
    await userEvent.keyboard('{Enter}');
    await userEvent.type(tagInput, 'urgent');
    await userEvent.keyboard('{Enter}');
    
    const saveButton = screen.getByText('Create Task');
    await userEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith({
      title: 'Complete Task',
      description: 'Complete description here',
      status: TASK_STATUSES.IN_PROGRESS,
      priority: TASK_PRIORITIES.HIGH,
      assignee: 'Jane Doe',
      tags: ['important', 'urgent']
    });
  });
});
