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

  ipcMain.handle(IPC_CHANNELS.GET_ITEMS, (event, type: 'rewards' | 'ideas' | 'tags' | 'habits' | 'habit_stacks' | 'projects' | 'todo_lists' | 'todo_items') => {
    db.read()
    return db.data[type]
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_ITEM, (event, id: number, type: 'rewards' | 'ideas' | 'tags' | 'habits' | 'habit_stacks' | 'projects' | 'todo_lists' | 'todo_items') => {
    db.read()
    const items = db.data[type]
    const itemToDeleteIndex = items.findIndex(item => item.id === id)
    if (itemToDeleteIndex === -1) return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` }

    // Handle position updates of non nested items
    const itemToDelete = items[itemToDeleteIndex]

    if (type !== 'habits' && type !== 'todo_items') {
      items.forEach((item) => {
        if (item.position > itemToDelete.position) {
          item.position--
        }
      })
    }

    // Handle position updates of nested habits
    if (type === 'habits') {
      const habits = db.data.habits
      const habitToDelete = habits[itemToDeleteIndex]
      const habitToDeleteStack = habitToDelete.stack_id
      habits.forEach((habit) => {
        if (habit.stack_id === habitToDeleteStack && habit.position > habitToDelete.position) {
          habit.position--
        }
      })
    }

    // Handle position updates of nested todo_items
    if (type === 'todo_items') {
      const todoItems = db.data.todo_items
      const todoItemToDelete = todoItems[itemToDeleteIndex]
      const todoItemToDeleteList = todoItemToDelete.todo_list_id
      todoItems.forEach((todoItem) => {
        if (todoItem.todo_list_id === todoItemToDeleteList && todoItem.position > todoItemToDelete.position) {
          todoItem.position--
        }
      })
    }



    items.splice(itemToDeleteIndex, 1)
    db.write()
    event.sender.send(IPC_CHANNELS[type.toUpperCase() + '_UPDATED'])
    return { success: true, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} deleted!` }
  })

  ipcMain.handle(IPC_CHANNELS.MOVE_ITEM, (event, passedItem: Reward | Habit | Idea | Tag | HabitStack | TodoList | TodoItem, type: 'rewards' | 'habits' | 'ideas' | 'tags' | 'habit_stacks' | 'todo_lists' | 'todo_items', direction: 'up' | 'down') => {
    db.read()
    const items = db.data[type]
    const itemToMoveIndex = items.findIndex(item => item.id === passedItem.id)

    if (itemToMoveIndex === -1) return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` }
    if (direction !== 'up' && direction !== 'down') return { success: false, message: 'No valid Direction specified' }

    if (type !== 'habits' && type !== 'todo_items') {
      const itemToMove = items[itemToMoveIndex]
      const currentPosition = itemToMove.position

      // Already at TOP
      if (currentPosition === 0 && direction === 'up') return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} already placed first.` }
      // Already at BOTTOM
      if (currentPosition === items.length - 1 && direction === 'down') return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} already placed last.` }

      const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1
      const itemToSwapIndex = items.findIndex(item => item.position === newPosition)
      const itemToSwap = items[itemToSwapIndex]

      itemToSwap.position = currentPosition
      itemToMove.position = newPosition
    }

    if(type === 'habits') {
      const habits = db.data.habits
      const habitToMove = habits[itemToMoveIndex]
      const habitToMoveStack = habitToMove.stack_id
      const habitsInSameStack = habits.filter(habit => habit.stack_id === habitToMoveStack)

      const currentPosition = habitToMove.position

      // Already at TOP
      if (currentPosition === 0 && direction === 'up') return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} already placed first.` }
      // Already at BOTTOM
      if (currentPosition === habitsInSameStack.length - 1 && direction === 'down') return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} already placed last.` }

      const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1
      const habitToSwapIndex = habitsInSameStack.findIndex(habit => habit.position === newPosition)
      const habitToSwap = habitsInSameStack[habitToSwapIndex]

      habitToSwap.position = currentPosition
      habitToMove.position = newPosition
    }

    if(type === 'todo_items') {
      const todoItems = db.data.todo_items
      const todoItemToMove = todoItems[itemToMoveIndex]
      const todoItemToMoveList = todoItemToMove.todo_list_id
      const todoItemsInSameList = todoItems.filter(todoItem => todoItem.todo_list_id === todoItemToMoveList)

      const currentPosition = todoItemToMove.position

      // Already at TOP
      if (currentPosition === 0 && direction === 'up') return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} already placed first.` }
      // Already at BOTTOM
      if (currentPosition === todoItemsInSameList.length - 1 && direction === 'down') return { success: false, message: `${type.charAt(0).toUpperCase() + type.slice(1, -1)} already placed last.` }

      const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1
      const todoItemToSwapIndex = todoItemsInSameList.findIndex(todoItem => todoItem.position === newPosition)
      const todoItemToSwap = todoItemsInSameList[todoItemToSwapIndex]

      todoItemToSwap.position = currentPosition
      todoItemToMove.position = newPosition
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

    if (!addedTag.title || addedTag.title.trim() === '') {
      return {
        success: false,
        message: 'Title is required'
      }
    }

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

  ipcMain.handle(IPC_CHANNELS.ADD_IDEA, (event, addedIdea: Idea) => {
    db.read()
    const nextId = (db.data.ideas.at(-1)?.id || 0) + 1
    const nextPosition = db.data.ideas.length

    if (!addedIdea.title || addedIdea.title.trim() === '') {
      return {
        success: false,
        message: 'Title is required'
      }
    }
    if (!addedIdea.description || addedIdea.description.trim() === '') {
      return {
        success: false,
        message: 'Description is required'
      }
    }

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

  // ========== REWARDS ==========
  ipcMain.handle(IPC_CHANNELS.ADD_REWARD, (event, addedReward: Reward) => {
    db.read()
    const nextId = (db.data.rewards.at(-1)?.id || 0) + 1
    const nextPosition = db.data.rewards.length

    if (!addedReward.title || addedReward.title.trim() === '') {
      return {
        success: false,
        message: 'Title is required'
      }
    }
    if (!addedReward.cost || addedReward.cost <= 0) {
      return {
        success: false,
        message: 'Cost must be greater than 0'
      }
    }

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
  ipcMain.handle(IPC_CHANNELS.ADD_HABIT_STACK, (event, addedHabitStack: HabitStack) => {
    db.read()
    const nextId = (db.data.habit_stacks.at(-1)?.id || 0) + 1
    const nextPosition = db.data.habit_stacks.length

    if (!addedHabitStack.title || addedHabitStack.title.trim() === '') {
      return {
        success: false,
        message: 'Title is required'
      }
    }

    const newHabitStack = {
      id: nextId,
      title: addedHabitStack.title,
      position: nextPosition,
    }
    db.data.habit_stacks.push(newHabitStack)

    db.write()
    event.sender.send(IPC_CHANNELS.HABIT_STACKS_UPDATED)
    return {
      success: true,
      message: 'New habit stack added!'
    }
  })

  ipcMain.handle(IPC_CHANNELS.EDIT_HABIT_STACK, (event, editedHabitStack: HabitStack) => {
    db.read()
    const index = db.data.habit_stacks.findIndex(habitStack => habitStack.id === editedHabitStack.id)
    if (index === -1) return { success: false, message: 'Habit stack not found' }

    const habitStackToUpdate = db.data.habit_stacks[index]
    habitStackToUpdate.title = editedHabitStack.title

    db.write()
    event.sender.send(IPC_CHANNELS.HABIT_STACKS_UPDATED)

    return {
      success: true,
      message: 'Habit stack updated!'
    }
  })

  // ========== HABITS ==========
  ipcMain.handle(IPC_CHANNELS.ADD_HABIT, (event, addedHabit: Habit) => {
    db.read()
    const nextId = (db.data.habits.at(-1)?.id || 0) + 1
    // find the next position in the same stack
    const nextPosition = db.data.habits.filter(habit => habit.stack_id === addedHabit.stack_id).length
    console.log(nextPosition)

    if (!addedHabit.title || addedHabit.title.trim() === '') {
      return {
        success: false,
        message: 'Title is required'
      }
    }
    if (!addedHabit.tag_name) {
      return {
        success: false,
        message: 'Tag is required'
      }
    }
    if (!addedHabit.stack_id) {
      return {
        success: false,
        message: 'Stack ID is required'
      }
    }

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
    const newHabitStack = editedHabit.stack_id
    const oldHabitStack = habitToUpdate.stack_id
    // update position if stack_id changed
    if (newHabitStack !== oldHabitStack) {
      habitToUpdate.position = db.data.habits.filter(habit => habit.stack_id === newHabitStack).length
    }

    habitToUpdate.title = editedHabit.title
    habitToUpdate.tag_name = editedHabit.tag_name
    habitToUpdate.stack_id = editedHabit.stack_id

    db.write()
    event.sender.send(IPC_CHANNELS.HABITS_UPDATED)
    return { success: true, message: 'Habit updated!' }
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