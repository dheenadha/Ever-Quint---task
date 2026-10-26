import React from 'react';
import { useTaskContext } from '../../context/TaskContext.jsx';
import Button from '../../components/ui/Button.jsx';

/**
 * TaskCreationGuide component to help users get started
 */
const TaskCreationGuide = () => {
  const { openTaskModal, hasTasks } = useTaskContext();

  if (hasTasks) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Welcome to Your Team Workflow Board</h3>
            <p className="text-gray-600 mt-1">
              Get started by creating your first task or explore the board to see how tasks flow through your workflow.
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => openTaskModal()}
            className="bg-white border border-gray-300 hover:bg-gray-50"
          >
            Create Your First Task
          </Button>
          <Button
            variant="primary"
            onClick={() => openTaskModal()}
          >
            Quick Start
          </Button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          <span>Create tasks with titles, descriptions, and assignees</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          <span>Organize tasks across Backlog, In Progress, and Done columns</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>Use drag and drop to move tasks between columns</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCreationGuide;