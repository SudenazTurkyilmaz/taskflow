const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../data/tasks.json');

function readTask() {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
}
function writeTask(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
}

module.exports = {
    readTask,
    writeTask
};