import { ipcMain } from 'electron'
import db from './lowdb.js'

export function registerDBHandlers() {
  // Balance Functions
  ipcMain.handle('get-balance', () => {
    db.read()
    return db.data.balance
  })

  // Tag Functions
   ipcMain.handle('get-tags', () => {
    db.read()
    return db.data.tags
  })

    ipcMain.handle('add-tag', (event, newTag) => {
    db.read()

    const nextId = (db.data.tags.at(-1)?.id || 0) + 1
    const nextHierarchy = db.data.tags.length

    db.data.tags.push({
      id: nextId,
      label: newTag.label,
      level: 1,
      exp_current: 0,
      exp_needed: 60,
      hierarchy: nextHierarchy,
    })

    db.write()
    return true
  })

ipcMain.handle('update-tag', (event, updatedTag) => {
  db.read()
  const index = db.data.tags.findIndex((tag) => tag.id === updatedTag.id)

  if (index === -1) return false

  const tagToUpdate = db.data.tags[index]

  // Only update fields if they are provided
  if ('label' in updatedTag) tagToUpdate.label = updatedTag.label
  if ('level' in updatedTag) tagToUpdate.level = updatedTag.level
  if ('exp_current' in updatedTag) tagToUpdate.exp_current = updatedTag.exp_current
  if ('exp_needed' in updatedTag) tagToUpdate.exp_needed = updatedTag.exp_needed

  db.write()
  return true
})

ipcMain.handle('delete-tag', (event, id) => {
  db.read()
  db.data.tags = db.data.tags.filter(tag => tag.id !== id)
  db.write()
  return true
})

}