import React from 'react';
import { useTaskContext } from '../../context/TaskContext.jsx';
import TaskForm from './TaskForm.jsx';
import Modal from '../../components/ui/Modal.jsx';

/**
 * TaskModal component for creating and editing tasks in a modal
 */
const TaskModal = () => {
  const { 
    isTaskModalOpen, 
    selectedTask, 
    closeTaskModal 
  } = useTaskContext();

  return (
    <Modal 
      isOpen={isTaskModalOpen} 
      onClose={closeTaskModal}
      title={selectedTask ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <TaskForm 
        task={selectedTask}
        onSave={closeTaskModal}
        onCancel={closeTaskModal}
      />
    </Modal>
  );
};

export default TaskModal;