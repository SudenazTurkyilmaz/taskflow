const express = require('express');
const router = express.Router();
const { readTask, writeTask } = require('../controllers/taskController');
const { idValidation, taskExistenceValidation, taskBodyValidation, taskPartialValidation } = require('../middleware/taskValidation');

function pickFields(body){
  const result ={};
  ['title', 'description', 'assignee', 'status', 'priority'].forEach(field => {
    if (body[field] !== undefined) {
      result[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
    }
  });
  return result;
}

// GET /tasks?status=&priority=&assignee=&search=&page=&limit=&sort=
router.get('/', (req, res) => {
  const { status, priority, assignee, search, sort= 'createdAt' } = req.query;
  const page =Math.max(1,Number(req.query.page) || 1);
  const limit= Math.min(20, Math.max(1, Number(req.query.limit) || 10));

  let result = readTask();
  if (status) {
    result = result.filter(task => task.status === status);
  }
  if (priority) {
    result = result.filter(task => task.priority === priority);
  }
  if (assignee) {
    result = result.filter(task => task.assignee.toLowerCase() === assignee.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
        result = result.filter(task =>
            task.title.toLowerCase().includes(q) ||
            (task.description || '').toLowerCase().includes(q)
        );
  }
  if (sort==='title') {
    result.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
  }else if (sort === 'priority') {
    const order = { high: 3, medium: 2, low: 1 };
    result.sort((a, b) => order[b.priority] - order[a.priority]);
  }else{
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
 
  res.json({
    basarili: true,
    total,
    totalPages,
    page,
    limit,
    previousPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    tasks: result.slice(start, start + limit)
   });
});

// GET /tasks/report
router.get('/report', (req, res) => {
  const all = readTask();
  const countBy = (field) => all.reduce((acc, t) => {
    acc[t[field]] = (acc[t[field]] || 0) + 1;
    return acc;
  }, {});
  res.json({
    basarili: true,
    total: all.length,
    byStatus: countBy('status'),
    byPriority: countBy('priority'),
    byAssignee: countBy('assignee')
  });
});

// GET /tasks/:id
router.get('/:id', idValidation, taskExistenceValidation, (req, res) => {
  const task = readTask().find(t => t.id === Number(req.params.id));
  res.json({ basarili: true, task });
});

// POST /tasks
router.post('/', taskBodyValidation, (req, res) => {
  const tasks = readTask();
  const newTask = {
    id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    description: '',
    assignee: '',
    status: 'pending',
    priority: 'medium',
    ...pickFields(req.body),
    createdAt: new Date().toISOString().slice(0,10)
  };
  tasks.push(newTask);
  writeTask(tasks);
  res.status(201).json({ basarili: true, task: newTask });
});

// PUT /tasks/:id (tam güncelleme)
router.put('/:id', idValidation, taskExistenceValidation, taskBodyValidation, (req, res) => {
  const id =Number(req.params.id);
  const tasks = readTask();
  const index = tasks.findIndex(task => task.id === id);
  tasks[index]={
    id,
    description:'',
    assignee: '',
    status: 'pending',
    priority: 'medium',
    ...pickFields(req.body),
    createdAt: tasks[index].createdAt
  };
  writeTask(tasks);
  res.json({ basarili: true, task: tasks[index] });
});

// PATCH /tasks/:id (kısmi güncelleme)
router.patch('/:id', idValidation, taskExistenceValidation, taskPartialValidation, (req, res) => {
  const id = Number(req.params.id);
  const tasks = readTask();
  const index = tasks.findIndex(task => task.id === id);
  const updatedFields = pickFields(req.body);
  tasks[index] = {
    ...tasks[index],
    ...updatedFields,
    id,
    createdAt: tasks[index].createdAt
  };
  writeTask(tasks);
  res.json({ basarili: true, task: tasks[index] });
});

// DELETE /tasks/:id
router.delete('/:id', idValidation, taskExistenceValidation, (req, res) => {
  const id = Number(req.params.id);
  const tasks = readTask();
  const index = tasks.findIndex(task => task.id === id);
  const [deletedTask] = tasks.splice(index, 1);
  writeTask(tasks);
  res.json({ basarili: true, task: deletedTask });
});
module.exports = router;