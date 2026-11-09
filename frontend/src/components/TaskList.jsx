import TaskItem from './TaskItem.jsx'

function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div aria-hidden="true" className="empty-state-icon">✓</div>
        <h3 className="h5">Burada şimdilik görev yok</h3>
        <p className="mb-0">Aramana veya seçtiğin filtreye uygun görev bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
          task={task}
        />
      ))}
    </div>
  )
}

export default TaskList