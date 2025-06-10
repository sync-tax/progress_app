import { ipcMain } from 'electron'
import db from './lowdb.js'
import { IPC_CHANNELS } from '../../shared/ipcChannels'

import { useDates } from '../../shared/helpers/useDate'
import { Reward, Habit } from '../../shared/dbTypes'

const { getStartOfDay, isSameDateAsToday } = useDates()

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
    if (db.data.balance < amount) return { success: false, message: 'Not enough crystals!' }
    db.data.balance += amount
    db.write()
    return { success: true, message: 'Added ' + amount + ' crystals.' }
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

  ipcMain.handle(IPC_CHANNELS.ADD_IDEA, (event) => {
    db.read()
    const nextId = (db.data.ideas.at(-1)?.id || 0) + 1

    const newIdea = {
      id: nextId,
      title: '',
      description: '',
    }
    db.data.ideas.push(newIdea)

    db.write()
    event.sender.send(IPC_CHANNELS.IDEAS_UPDATED)
    return {
      success: true,
      message: 'New idea added!',
      newIdea
    }
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

  ipcMain.handle(IPC_CHANNELS.ADD_REWARD, (event, addedReward: Reward) => {
    db.read()
    const nextId = (db.data.rewards.at(-1)?.id || 0) + 1
    const nextPosition = (db.data.rewards.at(-1)?.position || 0) + 1

    if (addedReward.title === '') return { success: false, message: 'Reward title cannot be empty' }
    if (addedReward.cost === 0) return { success: false, message: 'Reward cost cannot be 0' }

    const newReward = {
      id: nextId,
      title: addedReward.title,
      cost: addedReward.cost,
      repeatable: addedReward.repeatable,
      position: nextPosition,
    }
    db.data.rewards.push(newReward)

    event.sender.send(IPC_CHANNELS.REWARDS_UPDATED)

    db.write()
    return {
      success: true,
      message: 'Reward added!',
      newReward
    }
  })

  ipcMain.handle(IPC_CHANNELS.EDIT_REWARD, (event, editedReward: Reward) => {
    db.read()
    const index = db.data.rewards.findIndex(reward => reward.id === editedReward.id)
    if (index === -1) return { success: false, message: 'Reward not found' }

    const rewardToUpdate = db.data.rewards[index]
    rewardToUpdate.title = editedReward.title
    rewardToUpdate.cost = editedReward.cost
    rewardToUpdate.repeatable = editedReward.repeatable

    db.write()
    event.sender.send(IPC_CHANNELS.REWARDS_UPDATED)
    return { success: true, message: 'Reward updated!' }
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_REWARD, (event, id: number) => {
    db.read()
    const index = db.data.rewards.findIndex(reward => reward.id === id)
    if (index === -1) return { success: false, message: 'Reward not found' }

    db.data.rewards.splice(index, 1)
    db.write()
    event.sender.send(IPC_CHANNELS.REWARDS_UPDATED)
    return { success: true, message: 'Reward deleted!' }
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
    const newBalance = db.data.balance - reward.cost
    db.data.balance = newBalance

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
      rewardCost: reward.cost
    }
  })

  // ========== HABITS STACKS ==========
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

  // ========== HABITS ==========
  ipcMain.handle(IPC_CHANNELS.GET_HABITS, () => {
    db.read()
    return db.data.habits
  })

  ipcMain.handle(IPC_CHANNELS.ADD_HABIT, (event, newHabit: { stack_id: number }) => {
    db.read()
    const nextId = (db.data.habits.at(-1)?.id || 0) + 1

    const addedHabit = {
      id: nextId,
      title: '',
      tag_name: db.data.tags.at(-1)?.title || 'Other',
      counter: 0,
      current_streak: 0,
      best_streak: 0,
      stack_id: newHabit.stack_id,
      position: 0,
      last_time_completed: new Date('1999-02-10T09:15:00'), // default value -> Probably kinda dumb solution
    }
    db.data.habits.push(addedHabit)

    db.write()
    event.sender.send(IPC_CHANNELS.HABITS_UPDATED)
    return {
      success: true,
      message: 'New Habit added!',
      addedHabit
    }
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

  ipcMain.handle(IPC_CHANNELS.TOGGLE_HABIT_COMPLETION, (event, habitId: number) => {
    db.read()
    const habitIndex = db.data.habits.findIndex(h => h.id === habitId)
    if (habitIndex === -1) {
      return { success: false, error: 'Habit not found' }
    }

    const habitToUpdate: Habit = { ...db.data.habits[habitIndex] }
    const todayDate = getStartOfDay(new Date())

    // Guard against a highly unlikely null from getStartOfDay(new Date())
    if (!todayDate) {
      console.error('Failed to get start of today. This should not happen.');
      // Consider how you want to handle this critical error. Maybe throw or return a specific error.
      return { success: false, error: 'Internal server error: Could not determine today\'s date.' };
    }

    if (isSameDateAsToday(habitToUpdate.last_time_completed)) {
      // UNCHECKING on the same day
      habitToUpdate.counter = (habitToUpdate.counter || 0) - 1
      habitToUpdate.current_streak = (habitToUpdate.current_streak || 0) - 1
      // Calculate yesterday relative to todayDate to ensure consistency
      const yesterdayDate = getStartOfDay(new Date(todayDate.getTime() - 24 * 60 * 60 * 1000))
      // yesterdayDate is Date | null, which is compatible with habitToUpdate.last_time_completed (Date | null)
      habitToUpdate.last_time_completed = yesterdayDate || null
    } else {
      // CHECKING for today
      habitToUpdate.counter = (habitToUpdate.counter || 0) + 1
      habitToUpdate.current_streak = (habitToUpdate.current_streak || 0) + 1

      if (habitToUpdate.current_streak > (habitToUpdate.best_streak || 0)) {
        habitToUpdate.best_streak = habitToUpdate.current_streak
      }
      // todayDate is confirmed as Date here due to the check above, compatible with habitToUpdate.last_time_completed
      habitToUpdate.last_time_completed = todayDate
    }

    // Ensure streaks and counters don't go below 0
    if (habitToUpdate.counter < 0) habitToUpdate.counter = 0;
    if (habitToUpdate.current_streak < 0) habitToUpdate.current_streak = 0;

    db.data.habits[habitIndex] = habitToUpdate
    db.write()

    // It's good practice to return the updated item
    return { success: true, habit: habitToUpdate }
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_ALL_STREAKS, () => {
    db.read()
    const habits: Habit[] = db.data.habits // Explicitly type if not already
    if (!habits || habits.length === 0) {
      return { success: true, updatedCount: 0, errors: [] }
    }

    const todayStart = getStartOfDay(new Date())
    if (!todayStart) {
      console.error('UPDATE_ALL_STREAKS: Failed to get start of today.');
      return { success: false, updatedCount: 0, errors: ['Failed to determine today\'s date.'] };
    }
    const yesterdayStart = getStartOfDay(new Date(todayStart.getTime() - 24 * 60 * 60 * 1000))
    if (!yesterdayStart) {
      console.error('UPDATE_ALL_STREAKS: Failed to get start of yesterday.');
      // This is also critical, handle appropriately
      return { success: false, updatedCount: 0, errors: ['Failed to determine yesterday\'s date.'] };
    }

    let updatedCount = 0
    const errors: string[] = [];

    for (let i = 0; i < habits.length; i++) {
      const habit = habits[i]; // habit is of type Habit
      if (habit.current_streak > 0) {
        const lastCompletedDate = getStartOfDay(habit.last_time_completed)

        // If last_time_completed is invalid or not set, lastCompletedDate will be null.
        // A streak exists but no valid completion date means it should be reset.
        let resetStreak = false;
        if (!lastCompletedDate) {
          resetStreak = true; // Streak exists, but no valid last completion date.
        } else {
          const isToday = lastCompletedDate.getTime() === todayStart.getTime();
          const wasYesterday = lastCompletedDate.getTime() === yesterdayStart.getTime();
          if (!isToday && !wasYesterday) {
            resetStreak = true; // Not completed today or yesterday
          }
        }

        if (resetStreak) {
          // Preserve best_streak if current_streak was higher before reset
          if (habit.current_streak > (habit.best_streak || 0)) {
            db.data.habits[i].best_streak = habit.current_streak;
          }
          db.data.habits[i].current_streak = 0;
          updatedCount++;
        }
      }
    }

    if (updatedCount > 0) {
      db.write()
    }
    return { success: true, updatedCount, errors };
  })
}