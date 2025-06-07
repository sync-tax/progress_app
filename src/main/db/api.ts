import { ipcMain } from 'electron'
import db from './lowdb.js'
import { IPC_CHANNELS } from '../../shared/ipcChannels'

import { Reward } from '../../shared/dbTypes'

// register handlers for ipc channels
// these handlers are used to update the database
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

  ipcMain.handle(IPC_CHANNELS.ADD_TAG, (event) => {
    db.read()
    const nextId = (db.data.tags.at(-1)?.id || 0) + 1

    const newTag = {
      id: nextId,
      title: '',
      level: 1,
      exp_current: 0,
      exp_needed: 60,
      time_spent: 0,
      created_at: new Date()
    }
    db.data.tags.push(newTag)

    db.write()
    event.sender.send(IPC_CHANNELS.TAGS_UPDATED)
    return {
      success: true,
      message: 'New tag added!',
      newTag
    }
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_TAG, (event, updatedTag: { id: number, title?: string, level?: number, exp_current?: number, exp_needed?: number, time_spent?: number, created_at?: Date }) => {
    db.read()
    const index = db.data.tags.findIndex(tag => tag.id === updatedTag.id)
    if (index === -1) return false

    const tagToUpdate = db.data.tags[index]
    if (updatedTag.title !== undefined) tagToUpdate.title = updatedTag.title
    if (updatedTag.level !== undefined) tagToUpdate.level = updatedTag.level
    if (updatedTag.exp_current !== undefined) tagToUpdate.exp_current = updatedTag.exp_current
    if (updatedTag.exp_needed !== undefined) tagToUpdate.exp_needed = updatedTag.exp_needed
    if (updatedTag.time_spent !== undefined) tagToUpdate.time_spent = updatedTag.time_spent
    if (updatedTag.created_at !== undefined) tagToUpdate.created_at = updatedTag.created_at

    db.write()
    return true
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_TAG, (event, id: number) => {
    db.read()
    db.data.tags = db.data.tags.filter(tag => tag.id !== id)
    db.write()
    event.sender.send(IPC_CHANNELS.TAGS_UPDATED)
    return true
  })

  // ========== IDEAS ==========
  ipcMain.handle(IPC_CHANNELS.GET_IDEAS, () => {
    db.read()
    return db.data.ideas
  })

  ipcMain.handle(IPC_CHANNELS.ADD_IDEA, (event, newIdea: { title: string, description: string }) => {
    db.read()
    const nextId = (db.data.ideas.at(-1)?.id || 0) + 1

    db.data.ideas.push({
      id: nextId,
      title: newIdea.title,
      description: newIdea.description,
    })

    db.write()
    return true
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_IDEA, (event, updatedIdea: { id: number, title?: string, description?: string }) => {
    db.read()
    const index = db.data.ideas.findIndex(idea => idea.id === updatedIdea.id)
    if (index === -1) return false

    const ideaToUpdate = db.data.ideas[index]
    if (updatedIdea.title !== undefined) ideaToUpdate.title = updatedIdea.title
    if (updatedIdea.description !== undefined) ideaToUpdate.description = updatedIdea.description

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

  ipcMain.handle(IPC_CHANNELS.ADD_REWARD, (event) => {
    db.read()
    const nextId = (db.data.rewards.at(-1)?.id || 0) + 1
    const nextPosition = (db.data.rewards.at(-1)?.position || 0) + 1

   const newReward = {
      id: nextId,
      title: '',
      cost: 0,
      repeatable: false,
      position: nextPosition,
    }
    db.data.rewards.push(newReward)

    event.sender.send(IPC_CHANNELS.REWARDS_UPDATED)

    db.write()
    return {
      success: true,
      message: 'New reward added!',
      newReward
    }
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_REWARD, (event, updatedReward: { id: number, title?: string, cost?: number, repeatable?: boolean, position?: number }) => {
    db.read()
    const index = db.data.rewards.findIndex(reward => reward.id === updatedReward.id)
    if (index === -1) return false

    const rewardToUpdate = db.data.rewards[index]
    if (updatedReward.title !== undefined) rewardToUpdate.title = updatedReward.title
    if (updatedReward.cost !== undefined) rewardToUpdate.cost = updatedReward.cost
    if (updatedReward.repeatable !== undefined) rewardToUpdate.repeatable = updatedReward.repeatable
    if (updatedReward.position !== undefined) rewardToUpdate.position = updatedReward.position

    db.write()
    return true
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_REWARD, (event, id: number) => {
    db.read()
    db.data.rewards = db.data.rewards.filter(reward => reward.id !== id)
    db.write()
    event.sender.send(IPC_CHANNELS.REWARDS_UPDATED)
  })

  ipcMain.handle(IPC_CHANNELS.UNLOCK_REWARD, (event, passedReward: Reward) => {
    db.read();
    const rewardIndex = db.data.rewards.findIndex(r => r.id === passedReward.id)

    if (rewardIndex === -1) {
      return { success: false, message: 'Uups, this reward does not exist.' }
    }

    const reward = db.data.rewards[rewardIndex]

    if (reward.cost > db.data.balance) {
      return { success: false, message: 'Not enough crystals!' }
    }

    // pay crystals for reward
    db.data.balance -= reward.cost

    // remove non-repeatable rewards
    if (!reward.repeatable) {
      db.data.rewards.splice(rewardIndex, 1)
    }

    db.write()

    // send updates to renderer
    event.sender.send(IPC_CHANNELS.BALANCE_UPDATED, db.data.balance)
    event.sender.send(IPC_CHANNELS.REWARDS_UPDATED)

    return { 
      success: true, 
      message: 'You unlocked ' + reward.title + '!', 
      newBalance: db.data.balance 
    }
  })
}

 // ========== HABITS ==========

 ipcMain.handle(IPC_CHANNELS.GET_HABIT_STACKS, () => {
    db.read()
    return db.data.habitstacks
 })

 ipcMain.handle(IPC_CHANNELS.ADD_HABIT_STACK, (event, newHabitStack: { title: string, position: number }) => {
    db.read()
    const nextId = (db.data.habitstacks.at(-1)?.id || 0) + 1

    db.data.habitstacks.push({
      id: nextId,
      title: newHabitStack.title,
      position: nextId,
    })

    db.write()
    return true
 })

 ipcMain.handle(IPC_CHANNELS.UPDATE_HABIT_STACK, (event, updatedHabitStack: { id: number, title?: string, position?: number }) => {
    db.read()
    const index = db.data.habitstacks.findIndex(habitStack => habitStack.id === updatedHabitStack.id)
    if (index === -1) return false

    const habitStackToUpdate = db.data.habitstacks[index]
    if (updatedHabitStack.title !== undefined) habitStackToUpdate.title = updatedHabitStack.title
    if (updatedHabitStack.position !== undefined) habitStackToUpdate.position = updatedHabitStack.position

    db.write()
    return true
 })
 
 ipcMain.handle(IPC_CHANNELS.DELETE_HABIT_STACK, (event, id: number) => {
    db.read()
    db.data.habitstacks = db.data.habitstacks.filter(habitStack => habitStack.id !== id)
    db.write()
    return true
 })

 ipcMain.handle(IPC_CHANNELS.GET_HABITS, () => {
    db.read()
    return db.data.habits
 })

 ipcMain.handle(IPC_CHANNELS.ADD_HABIT, (event, newHabit: { title: string, counter: number, current_streak: number, best_streak: number, tag_name: string, stack_id: number, position: number, last_time_completed: Date }) => {
    db.read()
    const nextId = (db.data.habits.at(-1)?.id || 0) + 1

    db.data.habits.push({
      id: nextId,
      title: newHabit.title,
      tag_name: newHabit.tag_name,
      counter: 0,
      current_streak: 0,
      best_streak: 0,
      stack_id: newHabit.stack_id,
      position: 0,
      last_time_completed: new Date('1999-02-10T09:15:00'),
    })

    db.write()
    return true
 })

 ipcMain.handle(IPC_CHANNELS.UPDATE_HABIT, (event, updatedHabit: { id: number, title?: string, counter?: number, current_streak?: number, best_streak?: number, tag_name?: string, stack_id?: number, position?: number, last_time_completed?: Date }) => {
    db.read()
    const index = db.data.habits.findIndex(habit => habit.id === updatedHabit.id)
    if (index === -1) return false

    const habitToUpdate = db.data.habits[index]
    if (updatedHabit.title !== undefined) habitToUpdate.title = updatedHabit.title
    if (updatedHabit.counter !== undefined) habitToUpdate.counter = updatedHabit.counter
    if (updatedHabit.current_streak !== undefined) habitToUpdate.current_streak = updatedHabit.current_streak
    if (updatedHabit.best_streak !== undefined) habitToUpdate.best_streak = updatedHabit.best_streak
    if (updatedHabit.tag_name !== undefined) habitToUpdate.tag_name = updatedHabit.tag_name
    if (updatedHabit.stack_id !== undefined) habitToUpdate.stack_id = updatedHabit.stack_id
    if (updatedHabit.position !== undefined) habitToUpdate.position = updatedHabit.position
    if (updatedHabit.last_time_completed !== undefined) habitToUpdate.last_time_completed = updatedHabit.last_time_completed

    db.write()
    return true
 })

 ipcMain.handle(IPC_CHANNELS.DELETE_HABIT, (event, id: number) => {
    db.read()
    db.data.habits = db.data.habits.filter(habit => habit.id !== id)
    db.write()
    return true
 })
