import { useState } from 'react'

const emptyTask = {
  title: '',
  description: '',
  assignee: '',
  status: 'pending',
  priority: 'medium',
}

function TaskForm({ task, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(() => (task ? { ...emptyTask, ...task } : emptyTask))

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const saved = await onSubmit(form)
    if (saved && !task) setForm(emptyTask)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <p className="eyebrow mb-1">{task ? 'GÖREVİ DÜZENLE' : 'YENİ GÖREV'}</p>
          <h2 className="h5 mb-0">{task ? 'Görevi güncelle' : 'Yeni bir görev oluştur'}</h2>
        </div>
        {task && (
          <button
            aria-label="Düzenlemeyi iptal et"
            className="btn-close"
            onClick={onCancel}
            type="button"
          />
        )}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="title">Görev başlığı</label>
        <input
          autoFocus
          className="form-control"
          id="title"
          maxLength="100"
          minLength="3"
          name="title"
          onChange={handleChange}
          placeholder="Örn. Ana sayfa tasarımını tamamla"
          required
          value={form.title}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="description">Açıklama</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          onChange={handleChange}
          placeholder="Görevle ilgili kısa bir not ekle"
          rows="3"
          value={form.description}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="assignee">Atanan kişi</label>
        <input
          className="form-control"
          id="assignee"
          name="assignee"
          onChange={handleChange}
          placeholder="İsim"
          value={form.assignee}
        />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label" htmlFor="status">Durum</label>
          <select
            className="form-select"
            id="status"
            name="status"
            onChange={handleChange}
            value={form.status}
          >
            <option value="pending">Bekliyor</option>
            <option value="in-progress">Devam ediyor</option>
            <option value="completed">Tamamlandı</option>
          </select>
        </div>
        <div className="col-6">
          <label className="form-label" htmlFor="priority">Öncelik</label>
          <select
            className="form-select"
            id="priority"
            name="priority"
            onChange={handleChange}
            value={form.priority}
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary flex-grow-1" disabled={saving} type="submit">
          {saving ? 'Kaydediliyor...' : task ? 'Değişiklikleri kaydet' : 'Görev ekle'}
        </button>
        {task && (
          <button className="btn btn-light" onClick={onCancel} type="button">
            İptal
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm