import { ipcMain } from 'electron'
import db from './lowdb.js'
import { IPC_CHANNELS } from '../../shared/ipcChannels'

export function registerDBHandlers() {
  // ========== CRYSTALS ==========
  ipcMain.handle(IPC_CHANNELS.GET_BALANCE, () => {
    db.read()
    return db.data.balance
  })

  ipcMain.handle(IPC_CHANNELS.ADD_BALANCE, (event, amount: number) => {
    db.read()
    db.data.balance += amount
    db.write()
    event.sender.send(IPC_CHANNELS.BALANCE_UPDATED, db.data.balance)
    return true
  })

  ipcMain.handle(IPC_CHANNELS.REMOVE_BALANCE, (event, amount: number) => {
    db.read()
    db.data.balance -= amount
    db.write()
    event.sender.send(IPC_CHANNELS.BALANCE_UPDATED, db.data.balance)
    return true
  })

  // ========== TAGS ==========
  ipcMain.handle(IPC_CHANNELS.GET_TAGS, () => {
    db.read()
    return db.data.tags
  })

  ipcMain.handle(IPC_CHANNELS.ADD_TAG, (event, newTag: { title: string }) => {
    db.read()
    const nextId = (db.data.tags.at(-1)?.id || 0) + 1

    db.data.tags.push({
      id: nextId,
      title: newTag.title,
      level: 1,
      exp_current: 0,
      exp_needed: 60,
      time_spent: 0,
    })

    db.write()
    return true
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_TAG, (event, updatedTag: { id: number, title?: string, level?: number, exp_current?: number, exp_needed?: number, time_spent?: number }) => {
    db.read()
    const index = db.data.tags.findIndex(tag => tag.id === updatedTag.id)
    if (index === -1) return false

    const tagToUpdate = db.data.tags[index]
    if (updatedTag.title !== undefined) tagToUpdate.title = updatedTag.title
    if (updatedTag.level !== undefined) tagToUpdate.level = updatedTag.level
    if (updatedTag.exp_current !== undefined) tagToUpdate.exp_current = updatedTag.exp_current
    if (updatedTag.exp_needed !== undefined) tagToUpdate.exp_needed = updatedTag.exp_needed
    if (updatedTag.time_spent !== undefined) tagToUpdate.time_spent = updatedTag.time_spent

    db.write()
    return true
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_TAG, (event, id: number) => {
    db.read()
    db.data.tags = db.data.tags.filter(tag => tag.id !== id)
    db.write()
    return true
  })

  // ========== IDEAS ==========
  ipcMain.handle(IPC_CHANNELS.GET_IDEAS, () => {
    db.read()
    return db.data.ideas
  })

  ipcMain.handle(IPC_CHANNELS.ADD_IDEA, (event, newIdea: { title: string, description: string, rank: string }) => {
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

  ipcMain.handle(IPC_CHANNELS.UPDATE_IDEA, (event, updatedIdea: { id: number, title?: string, description?: string, rank?: string }) => {
    db.read()
    const index = db.data.ideas.findIndex(idea => idea.id === updatedIdea.id)
    if (index === -1) return false

    const ideaToUpdate = db.data.ideas[index]
    if (updatedIdea.title !== undefined) ideaToUpdate.title = updatedIdea.title
    if (updatedIdea.description !== undefined) ideaToUpdate.description = updatedIdea.description
    if (updatedIdea.rank !== undefined) ideaToUpdate.rank = updatedIdea.rank

    db.write()
    return true
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_IDEA, (event, id: number) => {
    db.read()
    db.data.ideas = db.data.ideas.filter(idea => idea.id !== id)
    db.write()
    return true
  })

  // ========== REWARDS ==========
  ipcMain.handle(IPC_CHANNELS.GET_REWARDS, () => {
    db.read()
    return db.data.rewards
  })

  ipcMain.handle(IPC_CHANNELS.ADD_REWARD, (event, newReward: { title: string, cost: number, rank: string, repeatable: boolean }) => {
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

  ipcMain.handle(IPC_CHANNELS.UPDATE_REWARD, (event, updatedReward: { id: number, title?: string, cost?: number, rank?: string, repeatable?: boolean }) => {
    db.read()
    const index = db.data.rewards.findIndex(reward => reward.id === updatedReward.id)
    if (index === -1) return false

    const rewardToUpdate = db.data.rewards[index]
    if (updatedReward.title !== undefined) rewardToUpdate.title = updatedReward.title
    if (updatedReward.cost !== undefined) rewardToUpdate.cost = updatedReward.cost
    if (updatedReward.rank !== undefined) rewardToUpdate.rank = updatedReward.rank
    if (updatedReward.repeatable !== undefined) rewardToUpdate.repeatable = updatedReward.repeatable

    db.write()
    return true
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_REWARD, (event, id: number) => {
    db.read()
    db.data.rewards = db.data.rewards.filter(reward => reward.id !== id)
    db.write()
    return true
  })
}
