import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard.jsx";
import { TASK_STATUSES } from "../../utils/constants.js";

const Column = ({ status, tasks }) => {
  const getStatusColor = (status) => {
    const colors = {
      [TASK_STATUSES.BACKLOG]: 'border-gray-300 bg-gray-50',
      [TASK_STATUSES.IN_PROGRESS]: 'border-blue-300 bg-blue-50',
      [TASK_STATUSES.DONE]: 'border-green-300 bg-green-50'
    };
    return colors[status] || colors[TASK_STATUSES.BACKLOG];
  };

  const getTaskCountColor = (count) => {
    if (count === 0) return 'text-gray-400 bg-gray-100';
    if (count <= 3) return 'text-green-600 bg-green-100';
    if (count <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
      getStatusColor(status)
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-sm flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${
              status === TASK_STATUSES.BACKLOG ? 'bg-gray-400' :
              status === TASK_STATUSES.IN_PROGRESS ? 'bg-blue-400' : 'bg-green-400'
            }`}></span>
            <span>{status}</span>
          </h2>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            getTaskCountColor(tasks.length)
          }`}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 space-y-3 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver 
                ? `bg-opacity-50 ${getStatusColor(status).replace('border-', 'bg-')}` 
                : 'bg-white'
            }`}
          >
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 italic">
                <div className="text-4xl mb-2">📋</div>
                <div>No tasks</div>
                <div className="text-xs mt-1">Drop tasks here or create new ones</div>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default React.memo(Column);
