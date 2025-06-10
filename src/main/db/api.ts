import { ipcMain } from 'electron'
import db from './lowdb.js'
import { IPC_CHANNELS } from '../../shared/ipcChannels'

import { useDates } from '../../shared/helpers/useDate'
import { Reward, Habit, Tag, Idea, TodoList, TodoItem, HabitStack, Project } from '../../shared/dbTypes'

const { getStartOfDay, isSameDateAsToday } = useDates()

// register handlers for ipc channels
// these handlers are used to update the database
export function registerDBHandlers() {
  // ========== UNIVERSAL ==========

  ipcMain.handle(IPC_CHANNELS.GET_ITEMS, (event, type: 'rewards' | 'ideas' | 'tags' | 'habits' | 'habitStacks' | 'projects' | 'todoLists' | 'todoItems') => {
    db.read()
    return db.data[type]
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_ITEM, (event, id: number, type: 'rewards' | 'ideas' | 'tags' | 'habits' | 'habitStacks' | 'projects' | 'todoLists' | 'todoItems') => {
    db.read()
    const items = db.data[type]
    const itemToDeleteIndex = items.findIndex(item => item.id === id)
    if (itemToDeleteIndex === -1) return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` }

    items.splice(itemToDeleteIndex, 1)
    db.write()
    event.sender.send(IPC_CHANNELS[type.toUpperCase() + '_UPDATED'])
    return { success: true, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} deleted!` }
  })

  ipcMain.handle(IPC_CHANNELS.MOVE_ITEM, (event, passedItem: Reward | Habit | Idea | Tag | HabitStack | TodoList | TodoItem, type: 'reward' | 'habit' | 'idea' | 'tag' | 'habitStack' | 'todoList' | 'todoItem', direction: 'up' | 'down') => {
    db.read()
    const items = db.data[type]
    const itemToMoveIndex = items.findIndex(item => item.id === passedItem.id)

    if (itemToMoveIndex === -1) return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` }
    if (direction !== 'up' && direction !== 'down') return { success: false, message: 'No valid Direction specified' }

    const itemToMove = items[itemToMoveIndex]
    const originalPosition = itemToMove.position

    if (direction === 'up') {
      if (originalPosition === 0) {
        return {
          success: false,
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} already placed first.`
        }
      }
      const newPosition = originalPosition - 1
      const itemToSwapIndex = items.findIndex(item => item.position === newPosition)

      if (itemToSwapIndex > -1) {
        items[itemToSwapIndex].position = originalPosition
      }
      itemToMove.position = newPosition
    } else if (direction === 'down') {
      const maxPosition = items.length - 1
      if (originalPosition === maxPosition) {
        return {
          success: false,
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} already placed last.`
        }
      }
      const newPosition = originalPosition + 1
      const itemToSwapIndex = items.findIndex(item => item.position === newPosition)

      if (itemToSwapIndex > -1) {
        items[itemToSwapIndex].position = originalPosition
      }
      itemToMove.position = newPosition
    }

    db.write()
    event.sender.send(IPC_CHANNELS[type.toUpperCase() + '_UPDATED'])
    return { success: true, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} moved!` }
  })

  // ========== USER ==========
  ipcMain.handle(IPC_CHANNELS.GET_BALANCE, () => {
    db.read()
    return db.data.user.balance
  })

  // ========== TAGS ==========
  ipcMain.handle(IPC_CHANNELS.ADD_TAG, (event, addedTag: Tag) => {
    db.read()
    const nextId = (db.data.tags.at(-1)?.id || 0) + 1
    const nextPosition = db.data.tags.length

    const newTag = {
      id: nextId,
      title: addedTag.title,
      level: 1,
      exp_current: 0,
      exp_needed: 60,
      time_spent: 0,
      created_at: (new Date()).toISOString(),
      position: nextPosition
    }
    db.data.tags.push(newTag)

    db.write()
    event.sender.send(IPC_CHANNELS.TAGS_UPDATED)
    return {
      success: true,
      message: 'New tag added!'
    }
  })

  ipcMain.handle(IPC_CHANNELS.EDIT_TAG, (event, editedTag: Tag) => {
    db.read()
    const index = db.data.tags.findIndex(tag => tag.id === editedTag.id)
    if (index === -1) return { success: false, message: 'Tag not found' }

    const tagToUpdate = db.data.tags[index]
    tagToUpdate.title = editedTag.title

    db.write()
    event.sender.send(IPC_CHANNELS.TAGS_UPDATED)
    return { success: true, message: 'Tag updated!' }
  })

  // ========== IDEAS ==========
  ipcMain.handle(IPC_CHANNELS.GET_IDEAS, () => {
    db.read()
    return db.data.ideas
  })

  ipcMain.handle(IPC_CHANNELS.ADD_IDEA, (event, addedIdea: Idea) => {
    db.read()
    const nextId = (db.data.ideas.at(-1)?.id || 0) + 1
    const nextPosition = db.data.ideas.length

    const newIdea = {
      id: nextId,
      title: addedIdea.title,
      description: addedIdea.description,
      position: nextPosition
    }
    db.data.ideas.push(newIdea)

    db.write()
    event.sender.send(IPC_CHANNELS.IDEAS_UPDATED)
    return {
      success: true,
      message: 'New idea added!'
    }
  })

  ipcMain.handle(IPC_CHANNELS.EDIT_IDEA, (event, updatedIdea: Idea) => {
    db.read()
    const index = db.data.ideas.findIndex(idea => idea.id === updatedIdea.id)
    if (index === -1) return { success: false, message: 'Idea not found' }

    const ideaToUpdate = db.data.ideas[index]
    ideaToUpdate.title = updatedIdea.title
    ideaToUpdate.description = updatedIdea.description

    db.write()
    event.sender.send(IPC_CHANNELS.IDEAS_UPDATED)
    return {
      success: true,
      message: 'Idea updated!'
    }
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_IDEA, (event, id: number) => {
    db.read()
    const index = db.data.ideas.findIndex(idea => idea.id === id)
    if (index === -1) return { success: false, message: 'Idea not found' }

    db.data.ideas.splice(index, 1)
    db.write()
    event.sender.send(IPC_CHANNELS.IDEAS_UPDATED)
    return {
      success: true,
      message: 'Idea deleted!'
    }
  })

  // ========== REWARDS ==========
  ipcMain.handle(IPC_CHANNELS.GET_REWARDS, () => {
    db.read()
    return db.data.rewards
  })

  ipcMain.handle(IPC_CHANNELS.ADD_REWARD, (event, addedReward: Reward) => {
    db.read()
    const nextId = (db.data.rewards.at(-1)?.id || 0) + 1
    const nextPosition = db.data.rewards.length

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
      message: 'Reward added!'
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
    const index = db.data.rewards.findIndex(reward => reward.id === passedReward.id)
    if (index === -1) return { success: false, message: 'Reward not found' }

    const reward = db.data.rewards[index]

    // check if enough crystals
    if (reward.cost > db.data.user.balance) return { success: false, message: 'Not enough crystals!' }

    // substract crystals from balance
    const newBalance = db.data.user.balance - reward.cost
    db.data.user.balance = newBalance

    // remove non-repeatable rewards
    if (!reward.repeatable) db.data.rewards.splice(index, 1)

    db.write()

    // TODO: Remove passing user balance -> don't need it
    event.sender.send(IPC_CHANNELS.BALANCE_UPDATED, db.data.user.balance)
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

  ipcMain.handle(IPC_CHANNELS.ADD_HABIT_STACK, (event, addedHabitStack: HabitStack) => {
    db.read()
    const nextId = (db.data.habitstacks.at(-1)?.id || 0) + 1
    const nextPosition = db.data.habitstacks.length

    const newHabitStack = {
      id: nextId,
      title: addedHabitStack.title,
      position: nextPosition,
    }
    db.data.habitstacks.push(newHabitStack)

    db.write()
    event.sender.send(IPC_CHANNELS.HABIT_STACKS_UPDATED)
    return {
      success: true,
      message: 'New habit stack added!'
    }
  })

  ipcMain.handle(IPC_CHANNELS.EDIT_HABIT_STACK, (event, editedHabitStack: HabitStack) => {
    db.read()
    const index = db.data.habitstacks.findIndex(habitStack => habitStack.id === editedHabitStack.id)
    if (index === -1) return { success: false, message: 'Habit stack not found' }

    const habitStackToUpdate = db.data.habitstacks[index]
    habitStackToUpdate.title = editedHabitStack.title

    db.write()
    event.sender.send(IPC_CHANNELS.HABIT_STACKS_UPDATED)

    return {
      success: true,
      message: 'Habit stack updated!'
    }
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_HABIT_STACK, (event, id: number) => {
    db.read()
    const index = db.data.habitstacks.findIndex(habitStack => habitStack.id === id)
    if (index === -1) return { success: false, message: 'Habit stack not found' }

    db.data.habitstacks.splice(index, 1)
    db.write()
    event.sender.send(IPC_CHANNELS.HABIT_STACKS_UPDATED)
    return {
      success: true,
      message: 'Habit stack deleted!'
    }
  })

  // ========== HABITS ==========
  ipcMain.handle(IPC_CHANNELS.GET_HABITS, () => {
    db.read()
    return db.data.habits
  })

  ipcMain.handle(IPC_CHANNELS.ADD_HABIT, (event, addedHabit: Habit) => {
    db.read()
    const nextId = (db.data.habits.at(-1)?.id || 0) + 1
    const nextPosition = db.data.habits.length

    const newHabit = {
      id: nextId,
      title: addedHabit.title,
      tag_name: addedHabit.tag_name,
      counter: 0,
      current_streak: 0,
      best_streak: 0,
      stack_id: addedHabit.stack_id,
      position: nextPosition,
      last_time_completed: (new Date('1999-02-10T09:15:00')).toISOString(), // just a default value
    }
    db.data.habits.push(newHabit)

    db.write()
    event.sender.send(IPC_CHANNELS.HABITS_UPDATED)
    return {
      success: true,
      message: 'New Habit added!',
      addedHabit
    }
  })

  ipcMain.handle(IPC_CHANNELS.EDIT_HABIT, (event, editedHabit: Habit) => {
    db.read()
    const index = db.data.habits.findIndex(habit => habit.id === editedHabit.id)
    if (index === -1) return { success: false, message: 'Habit not found' }

    const habitToUpdate = db.data.habits[index]
    habitToUpdate.title = editedHabit.title
    habitToUpdate.tag_name = editedHabit.tag_name
    habitToUpdate.stack_id = editedHabit.stack_id

    db.write()
    event.sender.send(IPC_CHANNELS.HABITS_UPDATED)
    return { success: true, message: 'Habit updated!' }
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_HABIT, (event, id: number) => {
    db.read()
    const index = db.data.habits.findIndex(habit => habit.id === id)
    if (index === -1) return { success: false, message: 'Habit not found' }

    db.data.habits.splice(index, 1)
    db.write()
    event.sender.send(IPC_CHANNELS.HABITS_UPDATED)
    return { success: true, message: 'Habit deleted!' }
  })

  ipcMain.handle(IPC_CHANNELS.TOGGLE_HABIT_COMPLETION, (event, habitId: number) => {
    db.read()
    const habitIndex = db.data.habits.findIndex(habit => habit.id === habitId)
    if (habitIndex === -1) return { success: false, error: 'Habit not found' }

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
      habitToUpdate.last_time_completed = yesterdayDate?.toISOString() || null
    } else {
      // CHECKING for today
      habitToUpdate.counter = (habitToUpdate.counter || 0) + 1
      habitToUpdate.current_streak = (habitToUpdate.current_streak || 0) + 1

      if (habitToUpdate.current_streak > (habitToUpdate.best_streak || 0)) {
        habitToUpdate.best_streak = habitToUpdate.current_streak
      }
      // todayDate is confirmed as Date here due to the check above, compatible with habitToUpdate.last_time_completed
      habitToUpdate.last_time_completed = todayDate.toISOString()
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