const statusLabels = {
  pending: 'Bekliyor',
  'in-progress': 'Devam ediyor',
  completed: 'Tamamlandı',
}

const priorityLabels = {
  low: 'Düşük öncelik',
  medium: 'Orta öncelik',
  high: 'Yüksek öncelik',
}

function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <article className={`task-card ${task.status === 'completed' ? 'is-completed' : ''}`}>
      <div className="task-card-main">
        <div className={`task-status-mark status-${task.status}`} aria-hidden="true">
          {task.status === 'completed' ? '✓' : ''}
        </div>
        <div className="flex-grow-1 min-width-0">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <h3 className="task-title mb-0">{task.title}</h3>
            <span className={`priority-badge priority-${task.priority}`}>
              {priorityLabels[task.priority] || task.priority}
            </span>
          </div>
          {task.description && <p className="task-description">{task.description}</p>}
          <div className="task-meta">
            <span className="task-assignee">
              <span aria-hidden="true">◉</span> {task.assignee || 'Atanan kişi yok'}
            </span>
            {task.createdAt && (
              <span>
                Oluşturulma: {new Date(`${task.createdAt}T00:00:00`).toLocaleDateString('tr-TR')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <select
          aria-label={`${task.title} görev durumu`}
          className="form-select form-select-sm status-select"
          onChange={(event) => onStatusChange(task, event.target.value)}
          value={task.status}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          aria-label={`${task.title} görevini düzenle`}
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onEdit(task)}
          type="button"
        >
          Düzenle
        </button>
        <button
          aria-label={`${task.title} görevini sil`}
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(task)}
          type="button"
        >
          Sil
        </button>
      </div>
    </article>
  )
}

export default TaskItem