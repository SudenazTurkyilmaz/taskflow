import { useCallback, useEffect, useMemo, useState } from 'react'
import TaskForm from '../components/TaskForm.jsx'
import TaskList from '../components/TaskList.jsx'
import { createTask, deleteTask, getTasks, updateTask } from '../services/tasks.js'

function TaskPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('createdAt')
  const [editingTask, setEditingTask] = useState(null)

  const loadTasks = useCallback(async (sortBy = sort) => {
    setLoading(true)
    setError('')
    try {
      setTasks(await getTasks(sortBy))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [sort])

  function handleSortChange(event) {
    const nextSort = event.target.value
    setSort(nextSort)
    loadTasks(nextSort)
  }

  useEffect(() => {
    let active = true

    async function loadInitialTasks() {
      try {
        const initialTasks = await getTasks('createdAt')
        if (active) setTasks(initialTasks)
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadInitialTasks()
    return () => {
      active = false
    }
  }, [])

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('tr-TR')
    return tasks.filter((task) => {
      const matchesFilter = filter === 'all' || task.status === filter
      const searchableText = `${task.title} ${task.description || ''} ${task.assignee || ''}`
        .toLocaleLowerCase('tr-TR')
      return matchesFilter && searchableText.includes(query)
    })
  }, [filter, search, tasks])

  const completedCount = tasks.filter((task) => task.status === 'completed').length
  const activeCount = tasks.filter((task) => task.status === 'in-progress').length
  const pendingCount = tasks.filter((task) => task.status === 'pending').length

  async function handleSave(taskData) {
    setSaving(true)
    setError('')
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData)
      } else {
        await createTask(taskData)
      }
      setEditingTask(null)
      await loadTasks()
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`"${task.title}" görevini silmek istediğine emin misin?`)) return

    setError('')
    try {
      await deleteTask(task.id)
      if (editingTask?.id === task.id) setEditingTask(null)
      await loadTasks()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleStatusChange(task, status) {
    setError('')
    try {
      await updateTask(task.id, { status })
      await loadTasks()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a aria-label="TaskFlow ana sayfa" className="brand" href="/">
          <span aria-hidden="true" className="brand-icon">✓</span>
          <span>task<span>flow</span></span>
        </a>
        <span className="topbar-note">Daha düzenli, daha verimli.</span>
      </header>

      <main className="container app-container">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">GÖREV YÖNETİMİ</p>
            <h1>İşlerini akışına bırak.</h1>
            <p className="welcome-copy">Bugünün işlerini planla, ilerlemeni takip et.</p>
          </div>
          <div className="welcome-decoration" aria-hidden="true">✳</div>
        </section>

        <section aria-label="Görev özeti" className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Toplam görev</span>
            <strong>{tasks.length}</strong>
            <span className="stat-caption">Tüm görevlerin</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Bekleyen</span>
            <strong>{pendingCount}</strong>
            <span className="stat-caption">Başlamaya hazır</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Devam eden</span>
            <strong>{activeCount}</strong>
            <span className="stat-caption">Üzerinde çalışılıyor</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Tamamlanan</span>
            <strong>{completedCount}</strong>
            <span className="stat-caption">Harika iş çıkardın!</span>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
            <span>{error}</span>
            <button aria-label="Mesajı kapat" className="btn-close ms-3" onClick={() => setError('')} type="button" />
          </div>
        )}

        <div className="content-grid">
          <section aria-labelledby="tasks-heading" className="tasks-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow mb-1">GENEL BAKIŞ</p>
                <h2 id="tasks-heading">Görevlerin</h2>
              </div>
              <span className="task-count">{filteredTasks.length} görev</span>
            </div>

            <div className="task-controls">
              <div className="search-wrap">
                <span aria-hidden="true" className="search-icon">⌕</span>
                <input
                  aria-label="Görevlerde ara"
                  className="form-control"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Görevlerde ara..."
                  value={search}
                />
              </div>
              <select
                aria-label="Görev durumuna göre filtrele"
                className="form-select filter-select"
                onChange={(event) => setFilter(event.target.value)}
                value={filter}
              >
                <option value="all">Tüm görevler</option>
                <option value="pending">Bekleyenler</option>
                <option value="in-progress">Devam edenler</option>
                <option value="completed">Tamamlananlar</option>
              </select>
              <select
                aria-label="Görevleri sıralama ölçütü"
                className="form-select sort-select"
                onChange={handleSortChange}
                value={sort}
              >
                <option value="createdAt">Tarihe göre</option>
                <option value="title">Başlığa göre</option>
                <option value="priority">Önceliğe göre</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-state">
                <div aria-label="Yükleniyor" className="spinner-border text-primary" role="status" />
                <span>Görevler yükleniyor...</span>
              </div>
            ) : (
              <TaskList
                onDelete={handleDelete}
                onEdit={setEditingTask}
                onStatusChange={handleStatusChange}
                tasks={filteredTasks}
              />
            )}
          </section>

          <aside aria-label={editingTask ? 'Görev düzenleme formu' : 'Yeni görev formu'} className="form-panel">
            <TaskForm
              key={editingTask?.id || 'new-task'}
              onCancel={() => setEditingTask(null)}
              onSubmit={handleSave}
              saving={saving}
              task={editingTask}
            />
          </aside>
        </div>

        <footer className="page-footer">TaskFlow <span>·</span> Görevlerini kolayca yönet.</footer>
      </main>
    </div>
  )
}

export default TaskPage