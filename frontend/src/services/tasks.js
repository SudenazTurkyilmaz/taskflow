const API_URL = (
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'
).replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Sunucudan geçerli bir yanıt alınamadı.')
  }

  if (!response.ok) {
    const message = Array.isArray(data.error)
      ? data.error.join(' ')
      : data.error || 'İşlem tamamlanamadı.'
    throw new Error(message)
  }

  return data
}

export async function getTasks(sort = 'createdAt') {
  const params = new URLSearchParams({ limit: '20', sort })
  const data = await request(`/tasks?${params}`)
  return data.tasks
}

export async function createTask(task) {
  const data = await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  })
  return data.task
}

export async function updateTask(id, task) {
  const data = await request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(task),
  })
  return data.task
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' })
}