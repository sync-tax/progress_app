import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import { join } from 'path'
import { app } from 'electron'

// Define where the JSON DB file should live (e.g., in AppData or ~/.config)
const file = join(app.getPath('userData'), 'db.json')

// Create adapter for reading/writing JSON
const adapter = new JSONFileSync(file)

// Create LowDB instance
const db = new LowSync(adapter, {
  balance: 0
})

// Read from disk (creates file if not present)
db.read()

// Save it immediately
db.write()

// Export the database
export default db
