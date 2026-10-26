import React from 'react';
import { useTaskContext } from '../context/TaskContext.jsx';
import Board from '../features/board/Board.jsx';
import FiltersBar from '../features/filters/FiltersBar.jsx';
import QuickTaskCreator from '../features/tasks/QuickTaskCreator.jsx';
import TaskCreationGuide from '../features/tasks/TaskCreationGuide.jsx';
import TaskModal from '../features/tasks/TaskModal.jsx';
import TaskEditModal from '../features/tasks/TaskEditModal.jsx';
import { Toaster } from '../components/ui/Toast.jsx';

/**
 * Main App component
 */
const App = () => {
  const { migrationCompleted, loading, openTaskModal } = useTaskContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">

            {/* Left */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Team Workflow Board
              </h1>
              <p className="text-sm text-gray-600">
                Manage your team's tasks and track progress
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3">

              {/* Create Task Button */}
              <button
                onClick={() => openTaskModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm"
              >
                <span>+ New Task</span>
              </button>

              {/* Migration status */}
              {!migrationCompleted && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-md text-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Setting up...</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Task Creation Guide */}
          <TaskCreationGuide />

          {/* Filters */}
          <div className="mb-6">
            <FiltersBar />
          </div>

          {/* Board */}
          <div className="h-[70vh]">
            <Board />
          </div>
        </div>
      </main>

      {/* Quick Task Creator */}
      <QuickTaskCreator />

      {/* Task Modal */}
      <TaskModal />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default App;
