import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import { join } from 'path'
import { app } from 'electron'
import defaultData from './defaultData'
import type { DbSchema } from '../../shared/dbTypes'

// Define where the JSON DB file should live (e.g., in AppData or ~/.config)
const file = join(app.getPath('userData'), 'db.json')

// Create adapter for reading/writing JSON
const adapter = new JSONFileSync<DbSchema>(file)

// Create LowDB instance with type
const db = new LowSync<DbSchema>(adapter, defaultData)

// Read from disk (creates file if not present)
db.read()

// Ensure default data is set if file is empty
db.data ||= defaultData

// Save it immediately
db.write()

export default db