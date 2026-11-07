const { readTask } = require('../controllers/taskController');

function idValidation(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ 
            basarili: false,
            error: 'Gecersiz ID' });
    }
    next();
};

function taskExistenceValidation(req, res, next) {
    const id = Number(req.params.id);
    const task = readTask().find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ 
            basarili: false,
            error: 'Task not found' });
    }
    next();
}
function taskBodyValidation(req, res, next) {
    const { title, description, assignee, status, priority } = req.body || {};
    const hatalar = [];
    if ( typeof title !== 'string' || title.trim() === ''){ 
        hatalar.push('Görev başlığı zorunludur.'); }
    else if (title.trim().length < 3) {
         hatalar.push('Görev başlığı en az 3 karakter olmalıdır.'); }
    else if (title.trim().length > 100) {
         hatalar.push('Görev başlığı en fazla 100 karakter olmalıdır.'); }

    if (description !== undefined && (typeof description !== 'string' ))
         hatalar.push('Açıklama metin türünde olmalıdır.');
    
    if (assignee !== undefined && typeof assignee !== 'string') {
        hatalar.push('Atanan kişi metin türünde olmalıdır.');
    }

    if (status !== undefined &&
        !['pending', 'in-progress', 'completed'].includes(status)) {
        hatalar.push('Geçersiz görev durumu.');
    }

    if (priority !== undefined &&
        !['low', 'medium', 'high'].includes(priority)) {
        hatalar.push('Geçersiz görev önceliği.');
    }

    if (hatalar.length > 0) {
    return res.status(400).json({
        basarili: false,
        error: hatalar
    });

    }
    next();
}

function taskPartialValidation(req, res, next) {
    const { title, description, assignee, status, priority } = req.body || {};
    const hatalar = [];

    if (
        title === undefined &&
        description === undefined &&
        assignee === undefined &&
        status === undefined &&
        priority === undefined
    ) {
        hatalar.push('En az bir alan gönderilmelidir.');
    }

    if (title !== undefined &&
        (typeof title !== 'string' ||
        title.trim().length < 3 ||
        title.trim().length > 100)) {
        hatalar.push('Başlık 3-100 karakter arasında olmalıdır.');
    }

    if (description !== undefined && typeof description !== 'string') {
        hatalar.push('Açıklama metin türünde olmalıdır.');
    }

    if (assignee !== undefined && typeof assignee !== 'string') {
        hatalar.push('Atanan kişi metin türünde olmalıdır.');
    }

    if (status !== undefined &&
        !['pending', 'in-progress', 'completed'].includes(status)) {
        hatalar.push('Geçersiz görev durumu.');
    }

    if (priority !== undefined &&
        !['low', 'medium', 'high'].includes(priority)) {
        hatalar.push('Geçersiz görev önceliği.');
    }

    if (hatalar.length > 0) {
        return res.status(400).json({
            basarili: false,
            error: hatalar
        });
    }
    next();
}

module.exports = {
    idValidation,
    taskExistenceValidation,
    taskBodyValidation,
    taskPartialValidation
};