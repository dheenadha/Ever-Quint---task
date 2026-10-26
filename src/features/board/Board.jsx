import React, { useCallback, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useTaskContext } from "../../context/TaskContext.jsx";
import Column from "./Column.jsx";
import { TASK_STATUSES } from "../../utils/constants.js";

const Board = () => {
  const { filteredTasks, moveTask } = useTaskContext();

  // Memoize task grouping to prevent unnecessary recalculations
  const groupedTasks = useMemo(() => {
    return {
      [TASK_STATUSES.BACKLOG]: filteredTasks.filter(t => t.status === TASK_STATUSES.BACKLOG),
      [TASK_STATUSES.IN_PROGRESS]: filteredTasks.filter(t => t.status === TASK_STATUSES.IN_PROGRESS),
      [TASK_STATUSES.DONE]: filteredTasks.filter(t => t.status === TASK_STATUSES.DONE)
    };
  }, [filteredTasks]);

  // Memoize drag end handler to prevent unnecessary re-renders
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    // Only proceed if status actually changed
    if (sourceStatus === destStatus) return;

    // Find the task by ID
    const draggedTask = filteredTasks.find(t => String(t.id) === draggableId);
    if (!draggedTask) return;

    // Move the task to new status
    const success = moveTask(draggedTask.id, destStatus);
    
    if (!success) {
      console.error('Failed to move task:', draggedTask.id);
    }
  }, [filteredTasks, moveTask]);

  // Memoize column rendering
  const columns = useMemo(() => {
    return Object.entries(groupedTasks).map(([status, tasks]) => (
      <Column key={status} status={status} tasks={tasks} />
    ));
  }, [groupedTasks]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns}
      </div>
    </DragDropContext>
  );
};

export default React.memo(Board);
