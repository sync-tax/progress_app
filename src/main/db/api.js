import { ipcMain } from 'electron'
import db from './lowdb.js'

export function registerDBHandlers() {
  // Balance Functions
  ipcMain.handle('get-balance', () => {
    db.read()
    return db.data.balance
  })
}