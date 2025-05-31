import { ipcMain } from 'electron'
import db from './lowdb.js'

export function registerDBHandlers() {
  // Balance Functions
  ipcMain.handle('get-balance', () => {
    db.read()
    return db.data.balance
  })

  ipcMain.handle('add-balance', (event, amount) => {
    db.read()
    db.data.balance += amount
    db.write()
    event.sender.send('balance-updated', db.data.balance)
    return true
  })

  ipcMain.handle('remove-balance', (event, amount) => {
    db.read()
    db.data.balance -= amount
    db.write()
    event.sender.send('balance-updated', db.data.balance)
    return true
  })

  // Tag Functions
  ipcMain.handle('get-tags', () => {
    db.read()
    return db.data.tags
  })

  ipcMain.handle('add-tag', (event, newTag) => {
    db.read()

    const nextId = (db.data.tags.at(-1)?.id || 0) + 1

    db.data.tags.push({
      id: nextId,
      title: newTag.title,
      level: 1,
      exp_current: 0,
      exp_needed: 60,
    })

    db.write()
    return true
  })

  ipcMain.handle('update-tag', (event, updatedTag) => {
    db.read()
    const index = db.data.tags.findIndex((tag) => tag.id === updatedTag.id)

    if (index === -1) return false

    const tagToUpdate = db.data.tags[index]

    // Update provided fields
    if ('title' in updatedTag) tagToUpdate.title = updatedTag.title
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

  // Idea Functions
  ipcMain.handle('get-ideas', () => {
    db.read()
    return db.data.ideas
  })

  ipcMain.handle('add-idea', (event, newIdea) => {
    db.read()

    const nextId = (db.data.ideas.at(-1)?.id || 0) + 1

    db.data.ideas.push({
      id: nextId,
      title: newIdea.title,
      description: newIdea.description,
      rank: newIdea.rank,
    })

    db.write()
    return true
  })

  ipcMain.handle('update-idea', (event, updatedIdea) => {
    db.read()
    const index = db.data.ideas.findIndex((idea) => idea.id === updatedIdea.id)

    if (index === -1) return false

    const ideaToUpdate = db.data.ideas[index]

    // Update provided fields
    if ('title' in updatedIdea) ideaToUpdate.title = updatedIdea.title
    if ('description' in updatedIdea) ideaToUpdate.description = updatedIdea.description
    if ('rank' in updatedIdea) ideaToUpdate.rank = updatedIdea.rank

    db.write()
    return true
  })

  ipcMain.handle('delete-idea', (event, id) => {
    db.read()
    db.data.ideas = db.data.ideas.filter(idea => idea.id !== id)
    db.write()
    return true
  })

  // Reward Functions
  ipcMain.handle('get-rewards', () => {
    db.read()
    return db.data.rewards
  })

  ipcMain.handle('add-reward', (event, newReward) => {
    db.read()

    const nextId = (db.data.rewards.at(-1)?.id || 0) + 1

    db.data.rewards.push({
      id: nextId,
      title: newReward.title,
      cost: newReward.cost,
      rank: newReward.rank,
      repeatable: newReward.repeatable,
    })

    db.write()
    return true
  })

  ipcMain.handle('update-reward', (event, updatedReward) => {
    db.read()
    const index = db.data.rewards.findIndex((reward) => reward.id === updatedReward.id)

    if (index === -1) return false

    const rewardToUpdate = db.data.rewards[index]

    // Update provided fields
    if ('title' in updatedReward) rewardToUpdate.title = updatedReward.title
    if ('cost' in updatedReward) rewardToUpdate.cost = updatedReward.cost
    if ('rank' in updatedReward) rewardToUpdate.rank = updatedReward.rank
    if ('repeatable' in updatedReward) rewardToUpdate.repeatable = updatedReward.repeatable

    db.write()
    return true
  })

  ipcMain.handle('delete-reward', (event, id) => {
    db.read()
    db.data.rewards = db.data.rewards.filter(reward => reward.id !== id)
    db.write()
    return true
  })  

}