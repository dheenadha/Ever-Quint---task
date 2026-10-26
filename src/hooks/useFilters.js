import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FILTER_KEYS, SORT_OPTIONS, TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants.js';

/**
 * Hook for managing task filters and URL synchronization
 * @param {Array} tasks - Array of tasks to filter
 * @returns {Object} Filter state and functions
 */
export function useFilters(tasks = []) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for filters
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    search: '',
    sort: SORT_OPTIONS.UPDATED_AT
  });

  // Initialize filters from URL params
  useEffect(() => {
    const urlStatus = searchParams.get(FILTER_KEYS.STATUS)?.split(',') || [];
    const urlPriority = searchParams.get(FILTER_KEYS.PRIORITY)?.split(',') || [];
    const urlSearch = searchParams.get(FILTER_KEYS.SEARCH) || '';
    const urlSort = searchParams.get(FILTER_KEYS.SORT) || SORT_OPTIONS.UPDATED_AT;

    setFilters({
      status: urlStatus.filter(status => Object.values(TASK_STATUSES).includes(status)),
      priority: urlPriority.filter(priority => Object.values(TASK_PRIORITIES).includes(priority)),
      search: urlSearch,
      sort: urlSort
    });
  }, [searchParams]);

  // Update URL params when filters change
  const updateUrlParams = useCallback((newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.status.length > 0) {
      params.set(FILTER_KEYS.STATUS, newFilters.status.join(','));
    }
    
    if (newFilters.priority.length > 0) {
      params.set(FILTER_KEYS.PRIORITY, newFilters.priority.join(','));
    }
    
    if (newFilters.search) {
      params.set(FILTER_KEYS.SEARCH, newFilters.search);
    }
    
    if (newFilters.sort !== SORT_OPTIONS.UPDATED_AT) {
      params.set(FILTER_KEYS.SORT, newFilters.sort);
    }
    
    setSearchParams(params);
  }, [setSearchParams]);

  // Filter tasks based on current filters - memoized for performance
  const filteredTasks = useMemo(() => {
    const searchLower = filters.search.toLowerCase();
    const statusSet = new Set(filters.status);
    const prioritySet = new Set(filters.priority);
    const hasStatusFilter = filters.status.length > 0;
    const hasPriorityFilter = filters.priority.length > 0;
    const hasSearchFilter = filters.search.length > 0;

    return tasks.filter(task => {
      // Status filter - optimized with Set
      if (hasStatusFilter && !statusSet.has(task.status)) {
        return false;
      }
      
      // Priority filter - optimized with Set
      if (hasPriorityFilter && !prioritySet.has(task.priority)) {
        return false;
      }
      
      // Search filter - optimized with early returns
      if (hasSearchFilter) {
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description.toLowerCase().includes(searchLower);
        const matchesAssignee = task.assignee.toLowerCase().includes(searchLower);
        const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesTitle && !matchesDescription && !matchesAssignee && !matchesTags) {
          return false;
        }
      }
      
      return true;
    });
  }, [tasks, filters.status, filters.priority, filters.search]);

  // Sort filtered tasks - memoized for performance
  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks];
    
    sorted.sort((a, b) => {
      switch (filters.sort) {
        case SORT_OPTIONS.CREATED_AT:
          return b.createdAt - a.createdAt;
          
        case SORT_OPTIONS.UPDATED_AT:
          return b.updatedAt - a.updatedAt;
          
        case SORT_OPTIONS.PRIORITY:
          const priorityA = a.priority;
          const priorityB = b.priority;
          if (priorityA === priorityB) {
            return b.updatedAt - a.updatedAt;
          }
          return priorityA === TASK_PRIORITIES.HIGH ? -1 : 
                 priorityB === TASK_PRIORITIES.HIGH ? 1 :
                 priorityA === TASK_PRIORITIES.MEDIUM ? -1 : 1;
          
        case SORT_OPTIONS.TITLE:
          return a.title.localeCompare(b.title);
          
        default:
          return b.updatedAt - a.updatedAt;
      }
    });
    
    return sorted;
  }, [filteredTasks, filters.sort]);

  // Filter setters - memoized
  const setStatusFilter = useCallback((statusArray) => {
    const newFilters = { ...filters, status: statusArray };
    setFilters(newFilters);
    updateUrlParams(newFilters);
  }, [filters, updateUrlParams]);

  const setPriorityFilter = useCallback((priorityArray) => {
    const newFilters = { ...filters, priority: priorityArray };
    setFilters(newFilters);
    updateUrlParams(newFilters);
  }, [filters, updateUrlParams]);

  const setSearchFilter = useCallback((searchValue) => {
    const newFilters = { ...filters, search: searchValue };
    setFilters(newFilters);
    updateUrlParams(newFilters);
  }, [filters, updateUrlParams]);

  const setSortFilter = useCallback((sortValue) => {
    const newFilters = { ...filters, sort: sortValue };
    setFilters(newFilters);
    updateUrlParams(newFilters);
  }, [filters, updateUrlParams]);

  // Filter actions - memoized
  const addStatusFilter = useCallback((status) => {
    if (!filters.status.includes(status)) {
      setStatusFilter([...filters.status, status]);
    }
  }, [filters.status, setStatusFilter]);

  const removeStatusFilter = useCallback((status) => {
    setStatusFilter(filters.status.filter(s => s !== status));
  }, [filters.status, setStatusFilter]);

  const addPriorityFilter = useCallback((priority) => {
    if (!filters.priority.includes(priority)) {
      setPriorityFilter([...filters.priority, priority]);
    }
  }, [filters.priority, setPriorityFilter]);

  const removePriorityFilter = useCallback((priority) => {
    setPriorityFilter(filters.priority.filter(p => p !== priority));
  }, [filters.priority, setPriorityFilter]);

  // Clear all filters - memoized
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      status: [],
      priority: [],
      search: '',
      sort: SORT_OPTIONS.UPDATED_AT
    };
    setFilters(clearedFilters);
    updateUrlParams(clearedFilters);
  }, [updateUrlParams]);

  // Check if filters are active - memoized
  const hasActiveFilters = useMemo(() => {
    return filters.status.length > 0 || 
           filters.priority.length > 0 || 
           filters.search.length > 0 || 
           filters.sort !== SORT_OPTIONS.UPDATED_AT;
  }, [filters]);

  // Get filter counts for display - memoized
  const filterCounts = useMemo(() => ({
    status: filters.status.length,
    priority: filters.priority.length,
    search: filters.search.length,
    total: filters.status.length + filters.priority.length + (filters.search ? 1 : 0)
  }), [filters]);

  return {
    // State
    filters,
    filteredTasks: sortedTasks,
    hasActiveFilters,
    filterCounts,

    // Setters
    setStatusFilter,
    setPriorityFilter,
    setSearchFilter,
    setSortFilter,

    // Actions
    addStatusFilter,
    removeStatusFilter,
    addPriorityFilter,
    removePriorityFilter,
    clearFilters,

    // Utilities
    isStatusFiltered: useCallback((status) => filters.status.includes(status), [filters.status]),
    isPriorityFiltered: useCallback((priority) => filters.priority.includes(priority), [filters.priority])
  };
}
