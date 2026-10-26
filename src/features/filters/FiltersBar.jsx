import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext.jsx';
import { TASK_STATUSES, TASK_PRIORITIES, SORT_OPTIONS } from '../../utils/constants.js';
import TextInput from '../../components/ui/TextInput.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';

/**
 * FiltersBar component for filtering and sorting tasks
 */
const FiltersBar = () => {
  const {
    filters,
    setStatusFilter,
    setPriorityFilter,
    setSearchFilter,
    setSortFilter,
    clearFilters,
    hasActiveFilters,
    filterCounts,
    filteredTasks
  } = useTaskContext();

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter options
  const statusOptions = Object.values(TASK_STATUSES).map(status => ({
    value: status,
    label: status
  }));

  const priorityOptions = Object.values(TASK_PRIORITIES).map(priority => ({
    value: priority,
    label: priority
  }));

  const sortOptions = [
    { value: SORT_OPTIONS.UPDATED_AT, label: 'Last Updated' },
    { value: SORT_OPTIONS.CREATED_AT, label: 'Created Date' },
    { value: SORT_OPTIONS.PRIORITY, label: 'Priority' },
    { value: SORT_OPTIONS.TITLE, label: 'Title' }
  ];

  // Handle status filter toggle
  const handleStatusToggle = (status) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    setStatusFilter(newStatuses);
  };

  // Handle priority filter toggle
  const handlePriorityToggle = (priority) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    setPriorityFilter(newPriorities);
  };

  // Clear individual filter
  const clearIndividualFilter = (filterType) => {
    switch (filterType) {
      case 'status':
        setStatusFilter([]);
        break;
      case 'priority':
        setPriorityFilter([]);
        break;
      case 'search':
        setSearchFilter('');
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* Main filter row */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <TextInput
            label="Search tasks"
            value={filters.search}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by title, description, assignee, or tags..."
            icon={
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            clearable
            onClear={() => setSearchFilter('')}
          />
        </div>

        {/* Sort */}
        <div className="w-56">
          <Select
            label="Sort by"
            value={filters.sort}
            onChange={(e) => setSortFilter(e.target.value)}
            options={sortOptions}
          />
        </div>

        {/* Results count and actions */}
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2"
          >
            <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{showAdvanced ? 'Hide' : 'Show'} Filters</span>
          </Button>
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Clear All</span>
            </Button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                <span>Status Filters</span>
                {filters.status.length > 0 && (
                  <button
                    onClick={() => clearIndividualFilter('status')}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => {
                  const isSelected = filters.status.includes(option.value);
                  const count = filteredTasks.filter(task => task.status === option.value).length;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleStatusToggle(option.value)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        option.value === TASK_STATUSES.BACKLOG ? 'bg-gray-400' :
                        option.value === TASK_STATUSES.IN_PROGRESS ? 'bg-blue-400' : 'bg-green-400'
                      }`}></span>
                      {option.label}
                      <span className={`ml-2 text-xs px-1 rounded ${
                        isSelected ? 'bg-white bg-opacity-30' : 'bg-gray-200'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                <span>Priority Filters</span>
                {filters.priority.length > 0 && (
                  <button
                    onClick={() => clearIndividualFilter('priority')}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((option) => {
                  const isSelected = filters.priority.includes(option.value);
                  const count = filteredTasks.filter(task => task.priority === option.value).length;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePriorityToggle(option.value)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        option.value === TASK_PRIORITIES.HIGH ? 'bg-red-400' :
                        option.value === TASK_PRIORITIES.MEDIUM ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></span>
                      {option.label}
                      <span className={`ml-2 text-xs px-1 rounded ${
                        isSelected ? 'bg-white bg-opacity-30' : 'bg-gray-200'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter summary and actions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Filter Summary
              </label>
              <div className="space-y-3">
                {hasActiveFilters ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {filters.status.map(status => (
                        <Badge
                          key={status}
                          variant="status"
                          className="text-xs"
                        >
                          Status: {status}
                          <button
                            onClick={() => clearIndividualFilter('status')}
                            className="ml-1 text-xs hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      {filters.priority.map(priority => (
                        <Badge
                          key={priority}
                          variant="priority"
                          className="text-xs"
                        >
                          Priority: {priority}
                          <button
                            onClick={() => clearIndividualFilter('priority')}
                            className="ml-1 text-xs hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      {filters.search && (
                        <Badge variant="tag" className="text-xs">
                          Search: "{filters.search}"
                          <button
                            onClick={() => clearIndividualFilter('search')}
                            className="ml-1 text-xs hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Sort:</span> {sortOptions.find(opt => opt.value === filters.sort)?.label}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded">
                    <div className="flex items-center space-x-2 mb-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>No filters applied</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Use filters to narrow down your tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter count summary with better styling */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-4 text-sm text-blue-800">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{filteredTasks.length} result{filteredTasks.length !== 1 ? 's' : ''} found</span>
            </span>
            <span className="text-blue-600">•</span>
            <span>{filterCounts.total} filter(s) active</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear all filters</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FiltersBar;
