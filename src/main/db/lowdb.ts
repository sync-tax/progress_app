import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import { join } from 'path'
import { app } from 'electron'
import defaultData from './defaultData'
import type { DbSchema } from '../../shared/dbTypes'

// save path of db.json
const file = join(app.getPath('userData'), 'db.json')

// creates the adapter
const adapter = new JSONFileSync<DbSchema>(file)

// creates the database
const db = new LowSync<DbSchema>(adapter, defaultData)

// reads the database
db.read()

// ensures default data if db is empty
db.data ||= defaultData

// saves it
db.write()

export default db