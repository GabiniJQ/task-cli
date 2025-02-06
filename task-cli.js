#!/usr/bin/env node

const { readTasks, writeTasks } = require('./task-utils.js')

const args = process.argv.slice(2)
const command = args[0]

function showHelp() {
  console.log(`
  Usage:
    task-cli list <status>                               - List all tasks or list filtered by status (done, in-progress, todo)
    task-cli add <task description>                      - Add a new task
    task-cli delete <task id>                            - Delete task by ID
    task-cli update <task id> <new description/status>   - Update task description or status by ID
    task-cli help                                        - Display this message
  `)
}

switch (command) {
  case 'add':
    if (!args[1]) {
      console.log('Error: Task description required.')
      process.exit(1)
    } else if (Number.isInteger(parseInt(args[1]))) {
      console.log('Error: Wrong task description format.')
      process.exit(1)
    }

    let tasks = readTasks()

    const newTask = {
      id: tasks.length + 1,
      description: args[1],
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tasks.push(newTask)
    writeTasks(tasks)
    console.log(`Task added successfully (ID: ${newTask.id})`)
    break

  case 'delete':
    if (!args[1]) {
      console.log('Error: Task ID required.')
      process.exit(1)
    }

    let deleteTasks = readTasks()
    const taskIdToDelete = parseInt(args[1])
    const filteredTasks = deleteTasks.filter(
      (task) => task.id !== taskIdToDelete
    )

    if (filteredTasks.length === deleteTasks.length) {
      console.log(`Task with ID: ${taskIdToDelete} not found.`)
      process.exit(1)
    }

    writeTasks(filteredTasks)
    console.log(`Task with ID: ${taskIdToDelete} deleted successfully.`)
    break

  case 'update':
    if (!args[1]) {
      console.log('Error: Task ID required.')
      process.exit(1)
    } else if (Number.isNaN(parseInt(args[1]))) {
      console.log('Error: Task ID must be a number.')
      process.exit(1)
    }

    if (!args[2]) {
      console.log('Error:"Task new description or status required.')
      process.exit(1)
    } else if (
      args[2] !== 'done' &&
      args[2] !== 'in-progress' &&
      args[2] !== 'todo'
    ) {
      let updateTasks = readTasks()
      const taskIdToUpdate = parseInt(args[1])
      const taskNewDescription = args[2]
      let taskUpdated = false

      const updatedTasks = updateTasks.map((task) => {
        if (task.id === taskIdToUpdate) {
          task.description = taskNewDescription
          task.updatedAt = new Date().toISOString()
          taskUpdated = true
        }
        return task
      })

      if (!taskUpdated) {
        console.log(`Task with ID ${taskIdToUpdate} not found.`)
        process.exit(1)
      }

      writeTasks(updatedTasks)
      console.log(`Task with ID ${taskIdToUpdate} updated successfully.`)
      break
    } else {
      let statusUpdate = readTasks()
      const statusIdToUpdate = parseInt(args[1])
      const statusLowCase = args[2].trim().toLowerCase()

      const updatedStatus = statusUpdate.map((task) => {
        if (task.id === statusIdToUpdate) {
          task.status = statusLowCase
          task.updatedAt = new Date().toISOString()
        }
        return task
      })
      writeTasks(updatedStatus)
      console.log(
        `Task with ID: ${statusIdToUpdate} status updated to "${statusLowCase}" successfully.`
      )
      break
    }

  case 'list':
    let listTasks = readTasks()

    if (!args[1]) {
      listTasks
        .map((task) =>
          console.log(
            `\n${task.description} (ID: ${task.id})\nStatus: ${task.status}\nCreated at: ${task.createdAt}\nLast update: ${task.updatedAt}\n`
          )
        )
        .join('\n')
    } else {
      const filterLowCase = args[1].trim().toLowerCase()
      const isValidFilter =
        filterLowCase === 'done' ||
        filterLowCase === 'in-progress' ||
        filterLowCase === 'todo'
          ? true
          : false
      let foundStatus = false

      if (filterLowCase && isValidFilter) {
        listTasks
          .map((task) => {
            if (task.status === filterLowCase) {
              console.log(
                `\n${task.description} (ID: ${task.id})\nStatus: ${task.status}\nCreated at: ${task.createdAt}\nLast update: ${task.updatedAt}\n`
              )
              foundStatus = true
            }
          })
          .join('\n')

        if (!foundStatus) {
          console.log(`There is no task with the status ${filterLowCase}`)
        }
      } else {
        console.log(`Error: Please enter a valid filter.`)
      }
    }
    break

  case 'help':
    showHelp()
    break
}
