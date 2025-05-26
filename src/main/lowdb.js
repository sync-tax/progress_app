import { JSONFileSync, LowSync } from 'lowdb'
import { join } from 'path'
import { app } from 'electron'

// Define where the JSON DB file should live (e.g., in AppData or ~/.config)
const file = join(app.getPath('userData'), 'db.json')

// Create adapter for reading/writing JSON
const adapter = new JSONFileSync(file)

// Create LowDB instance
const db = new LowSync(adapter)

// Read from disk (creates file if not present)
db.read()

// Set default structure if file is empty
db.data ||= {
  projects: [
    {
      id: 'proj-001',
      title: 'Test Project',
      description: 'Hello, you stink',
      difficulty: 'Common', // Common, Uncommon, Rare, Epic, Legendary
      tags: ['Coding'],
      todos: [
        { id: 'todo-1', text: 'Create project card layout', done: false },
        { id: 'todo-2', text: 'Render todos with v-for', done: false },
        { id: 'todo-3', text: 'Connect to timer', done: false }
      ],
      createdAt: new Date().toISOString(),
      completed: false
    }
  ],
  stats: {
    focusTime: {}
  }
}

// Save it immediately
db.write()

// Export the database
export default db
