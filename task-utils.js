const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'task.json')

// Ensure JSON File exists
function ensureFileExists() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf8')
  }
}

// Read Tasks from the file
function readTasks() {
  ensureFileExists()
  const data = fs.readFileSync(filePath, 'utf8')
  if (!data.trim()) {
    return []
  }

  return JSON.parse(data)
}

// Write Tasks to the file
function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8')
}

module.exports = { writeTasks, readTasks }
