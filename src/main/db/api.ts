import { ipcMain } from 'electron'
import db from './lowdb.js'
import { IPC_CHANNELS } from '../../shared/ipcChannels'

import { useDates } from '../../shared/helpers/useDate'
import { useProgressions } from '../../shared/helpers/useProgressions'
import { useConstants } from '../../shared/helpers/useConstants'
import { Reward, Habit, Tag, Idea, TodoList, TodoItem, HabitStack, Project } from '../../shared/dbTypes'

const { getToday, getYesterday } = useDates()
const { getHabitProgressionReward, getTodoListProgressionReward, getProjectProgressionReward, updateLevel } = useProgressions()
const { EXP_MULTIPLIER_USER, EXP_MULTIPLIER_TAGS } = useConstants()


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

    if (type === 'habit_stacks') {
      const numberOfHabitsInStack = db.data.habits.filter(habit => habit.stack_id === itemToDelete.id).length
      if (numberOfHabitsInStack > 0) return { success: false, message: 'There are still habits in this stack!' }
    }

    if (type === 'todo_lists') {
      const numberOfTodoItemsInList = db.data.todo_items.filter(todo_item => todo_item.todo_list_id === itemToDelete.id).length
      if (numberOfTodoItemsInList > 0) return { success: false, message: 'There are still todo items in this list!' }
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

    if (type === 'habits') {
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

    if (type === 'todo_items') {
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
  ipcMain.handle(IPC_CHANNELS.GET_BALANCE, (event) => {
    db.read()
    const balance = db.data.user.balance
    return balance
  })

  ipcMain.handle(IPC_CHANNELS.GET_USER_EXP, (event) => {
    db.read()
    const expCurrent = db.data.user.exp_current
    const expNeeded = db.data.user.exp_needed
    return { expCurrent, expNeeded }
  })

  ipcMain.handle(IPC_CHANNELS.GET_USER_LEVEL, (event) => {
    db.read()
    const level = db.data.user.level
    return level
  })

  ipcMain.handle(IPC_CHANNELS.ADD_TIME, (event, timeSpent: number, todoListId: number) => {
    db.read()
    const user = db.data.user
    const todoList = db.data.todo_lists.find(todoList => todoList.id === todoListId)
    if (!todoList) return { success: false, message: 'Todo List not found' }

    const linkedProject = db.data.projects.find(project => project.id === todoList.project_id)
    if (!linkedProject) return { success: false, message: 'Linked Project not found' }

    user.pomodoros++
    todoList.time_spent += timeSpent
    user.focused_time += timeSpent
    linkedProject.time_spent += timeSpent

    db.write()
    event.sender.send(IPC_CHANNELS.USER_LEVEL_UPDATED, db.data.user.level)
    return { success: true }
  })

  // ========== PROJECTS ==========
  ipcMain.handle(IPC_CHANNELS.EDIT_PROJECT, (event, editedProject: Project) => {
    db.read()
    const index = db.data.projects.findIndex(project => project.id === editedProject.id)
    if (index === -1) return { success: false, message: 'Project not found' }

    const projectToUpdate = db.data.projects[index]
    projectToUpdate.title = editedProject.title
    projectToUpdate.description = editedProject.description

    db.write()
    event.sender.send(IPC_CHANNELS.PROJECTS_UPDATED)
    return { success: true, message: 'Project updated!' }
  })

  ipcMain.handle(IPC_CHANNELS.ACTIVATE_PROJECT, (event, project: Project) => {
    db.read()
    const index = db.data.projects.findIndex(p => p.id === project.id)
    if (index === -1) return { success: false, message: 'Project not found' }

    const projectToUpdate = db.data.projects[index]
    if (projectToUpdate.active) return { success: false, message: 'Project already active' }

    const currentActiveProject = db.data.projects.find(p => p.active)
    if (currentActiveProject) {
      currentActiveProject.active = false
    }

    projectToUpdate.active = true

    db.write()
    event.sender.send(IPC_CHANNELS.PROJECTS_UPDATED)
    return { success: true, message: 'Project activated!' }
  })

  ipcMain.handle(IPC_CHANNELS.CLAIM_PROJECT_REWARD, (event, project: Project) => {
    db.read()
    const projectIndex = db.data.projects.findIndex(project => project.id === project.id)
    if (projectIndex === -1) return { success: false, message: 'Project not found' }

    const projectToUpdate = db.data.projects[projectIndex]
    const user = db.data.user
    const userLvlBefore = user.level

    let crystalsGained = 0
    let userExpGained = 0
    let levelUp = false

    if (!projectToUpdate.completed) return { success: false, message: 'Project not completed' }
    const reward = getProjectProgressionReward(projectToUpdate)
    crystalsGained = reward.crystals
    userExpGained = reward.userExp

    user.exp_gained += userExpGained
    user.crystals_gained += crystalsGained

    updateLevel(user, userExpGained, true)
    levelUp = user.level > userLvlBefore

    const nextDoneId = (db.data.projects_done.at(-1)?.id || 0) + 1
    db.data.projects_done.push({
      id: nextDoneId,
      name: projectToUpdate.title,
      created_at: projectToUpdate.created_at,
      time_spent: projectToUpdate.time_spent
    })

    db.data.projects = db.data.projects.filter(project => project.id !== projectToUpdate.id)
    db.data.user.projects_done += 1

    const nextProject = [...db.data.projects].sort((a, b) => a.id - b.id)[0]
    if (nextProject) {
      nextProject.active = true
    }
   

    db.write()
    event.sender.send(IPC_CHANNELS.PROJECTS_UPDATED)
    event.sender.send(IPC_CHANNELS.BALANCE_UPDATED, db.data.user.balance)
    event.sender.send(IPC_CHANNELS.USER_EXP_UPDATED, db.data.user.exp_current, db.data.user.exp_needed)
    event.sender.send(IPC_CHANNELS.USER_LEVEL_UPDATED, db.data.user.level)

    return { success: true, crystalsGained, userExpGained, levelUp }
  })

  // ========== TODO LISTS ==========

  ipcMain.handle(IPC_CHANNELS.ADD_TODO_LIST, (event, addedTodoList: TodoList) => {
    db.read()
    const nextId = (db.data.todo_lists.at(-1)?.id || 0) + 1
    const nextPosition = db.data.todo_lists.length

    if (!addedTodoList.title || addedTodoList.title.trim() === '') {
      return {
        success: false,
        message: 'Title is required'
      }
    }

    const newTodoList = {
      id: nextId,
      title: addedTodoList.title,
      time_spent: addedTodoList.time_spent,
      project_id: addedTodoList.project_id,
      tag_name: addedTodoList.tag_name,
      position: nextPosition
    }
    db.data.todo_lists.push(newTodoList)

    const projectIndex = db.data.projects.findIndex(project => project.id === addedTodoList.project_id)
    if (projectIndex !== -1) db.data.projects[projectIndex].completed = false

    db.write()
    event.sender.send(IPC_CHANNELS.TODO_LISTS_UPDATED)
    event.sender.send(IPC_CHANNELS.PROJECTS_UPDATED)
    return {
      success: true,
      message: 'New todo list added!'
    }
  })

  ipcMain.handle(IPC_CHANNELS.EDIT_TODO_LIST, (event, editedTodoList: TodoList) => {
    db.read()
    const index = db.data.todo_lists.findIndex(todoList => todoList.id === editedTodoList.id)
    if (index === -1) return { success: false, message: 'Todo List not found' }

    const todoListToUpdate = db.data.todo_lists[index]
    todoListToUpdate.title = editedTodoList.title
    todoListToUpdate.tag_name = editedTodoList.tag_name

    db.write()
    event.sender.send(IPC_CHANNELS.TODO_LISTS_UPDATED)
    return { success: true, message: 'Todo List updated!' }
  })

  ipcMain.handle(IPC_CHANNELS.CLAIM_TODO_LIST_REWARD, (event, todoList: TodoList) => {
    db.read()
    const claimedTodoListTasks = db.data.todo_items.filter(todoItem => todoItem.todo_list_id === todoList.id)
    const project = db.data.projects.find(project => project.id === todoList.project_id)
    if (!project) return { success: false, message: 'Project not found' }

    const claimedTodoListPosition = todoList.position

    const user = db.data.user
    const userLvlBefore = user.level

    const tag = db.data.tags.find(tag => tag.title === todoList.tag_name)
    if (!tag) return { success: false, message: 'Tag not found' }
    const tagLvlBefore = tag.level
    const tagTitle = tag.title
    
    let crystalsGained = 0
    let userExpGained = 0
    let tagExpGained = 0

    if(claimedTodoListTasks.every(todoItem => todoItem.completed)) {
      const reward = getTodoListProgressionReward(todoList, claimedTodoListTasks)

      console.log(reward)
      crystalsGained = reward.crystals
      userExpGained = reward.userExp
      tagExpGained = reward.tagExp

      updateLevel(user, userExpGained, true)
      updateLevel(tag, tagExpGained, false)

    db.data.user.balance += crystalsGained
    db.data.user.exp_current += userExpGained
    db.data.user.exp_needed += userExpGained

    user.exp_gained += userExpGained
    user.crystals_gained += crystalsGained

    db.data.todo_items = db.data.todo_items.filter(todoItem => todoItem.todo_list_id !== todoList.id)

    const todoListIndex = db.data.todo_lists.findIndex(tl => tl.id === todoList.id)
    
    if (todoListIndex !== -1) {
      db.data.todo_lists.splice(todoListIndex, 1)
    }

    } else {
      return { success: false, message: 'Not all tasks completed' }
    }

    let levelUp = false
    if (userLvlBefore < user.level) {
      levelUp = true
    }

    // check if tag leveled up
    let tagLevelUp = false
    if (tagLvlBefore < tag.level) {
      tagLevelUp = true
    }

    const todoListsInProject = db.data.todo_lists.filter(todoList => todoList.project_id === project.id)
    if (todoListsInProject.length === 0) {
      project.completed = true
    }

   //TODO Look for better normalisation of pos solution (maybe global event watcher or smth idk)
    db.data.todo_lists.forEach(todoList => {
      if (todoList.position > claimedTodoListPosition && todoList.project_id === project.id) {
        todoList.position--
      }
    })

    db.write()
    event.sender.send(IPC_CHANNELS.BALANCE_UPDATED, db.data.user.balance)
    event.sender.send(IPC_CHANNELS.USER_EXP_UPDATED, db.data.user.exp_current, db.data.user.exp_needed)
    event.sender.send(IPC_CHANNELS.USER_LEVEL_UPDATED, db.data.user.level)
    event.sender.send(IPC_CHANNELS.TODO_LISTS_UPDATED)
    event.sender.send(IPC_CHANNELS.PROJECTS_UPDATED)
    
    return { success: true, crystalsGained, userExpGained, tagExpGained, levelUp, tagLevelUp, tagTitle }
  })

  // ========== TODO ITEM ==========

  ipcMain.handle(IPC_CHANNELS.ADD_TODO_ITEM, (event, addedTodoItem: TodoItem) => {
    db.read()
    const nextId = (db.data.todo_items.at(-1)?.id || 0) + 1
    const nextPosition = db.data.todo_items.filter(todo_item => todo_item.todo_list_id === addedTodoItem.todo_list_id).length

    if (!addedTodoItem.title || addedTodoItem.title.trim() === '') {
      return {
        success: false,
        message: 'Title is required'
      }
    }

    const newTodoItem = {
      id: nextId,
      title: addedTodoItem.title,
      todo_list_id: addedTodoItem.todo_list_id,
      completed: false,
      position: nextPosition
    }
    db.data.todo_items.push(newTodoItem)

    db.write()
    event.sender.send(IPC_CHANNELS.TODO_ITEMS_UPDATED)
    event.sender.send(IPC_CHANNELS.TODO_LISTS_UPDATED)
    event.sender.send(IPC_CHANNELS.PROJECTS_UPDATED)
    return {
      success: true,
      message: 'New todo item added!'
    }
  })

  ipcMain.handle(IPC_CHANNELS.EDIT_TODO_ITEM, (event, editedTodoItem: TodoItem) => {
    db.read()
    const index = db.data.todo_items.findIndex(todoItem => todoItem.id === editedTodoItem.id)
    if (index === -1) return { success: false, message: 'Todo Item not found' }

    const todoItems = db.data.todo_items
    const todoItemToUpdate = todoItems[index]
    const newTodoList = editedTodoItem.todo_list_id
    const oldTodoList = todoItemToUpdate.todo_list_id

    if (newTodoList !== oldTodoList) {
      // update position of todo items in the old list
      todoItems.forEach(todoItem => {
        if (todoItem.todo_list_id === oldTodoList && todoItem.position > todoItemToUpdate.position) {
          todoItem.position--
        }
      })
      // put edited todo item in the end of the new list
      todoItemToUpdate.position = todoItems.filter(todoItem => todoItem.todo_list_id === newTodoList).length
    }

    todoItemToUpdate.title = editedTodoItem.title
    todoItemToUpdate.todo_list_id = editedTodoItem.todo_list_id

    db.write()
    event.sender.send(IPC_CHANNELS.TODO_ITEMS_UPDATED)
    return { success: true, message: 'Todo Item updated!' }
  })

  ipcMain.handle(IPC_CHANNELS.TOGGLE_TODO_ITEM_COMPLETION, (event, todo_item: TodoItem) => {
    db.read()
    const dbTodoItem = db.data.todo_items.find(todoItem => todoItem.id === todo_item.id)
    if (!dbTodoItem) return { success: false, message: 'Todo Item not found' }

    dbTodoItem.completed = !dbTodoItem.completed

    db.data.user.todos_done += 1

    db.write()

    event.sender.send(IPC_CHANNELS.TODO_ITEMS_UPDATED)
    return { success: true }
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

    db.data.user.ideas_total++

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

  ipcMain.handle(IPC_CHANNELS.CONVERT_IDEA_TO_PROJECT, (event, id: number) => {
    db.read()

    const ideaToConvert = db.data.ideas.find(idea => idea.id === id)
    if (!ideaToConvert) return { success: false, message: 'Idea not found' }

    const nextId = (db.data.projects.at(-1)?.id || 0) + 1
    const nextPosition = db.data.projects.length

    db.data.projects.push({
      id: nextId,
      title: ideaToConvert.title,
      description: ideaToConvert.description,
      time_spent: 0,
      active: false,
      completed: false,
      created_at: getToday(),
      position: nextPosition
    })

    const ideas = db.data.ideas
    ideas.forEach(idea => {
      if (idea.position > ideaToConvert.position) {
        idea.position--
      }
    })

    db.data.ideas = ideas.filter(idea => idea.id !== id)
    db.write()
    event.sender.send(IPC_CHANNELS.IDEAS_UPDATED)
    event.sender.send(IPC_CHANNELS.PROJECTS_UPDATED)
    return { success: true, message: 'New Project started!' }
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
      last_month_completed: []
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

    const habits = db.data.habits
    const habitToUpdate = habits[index]
    const newHabitStack = editedHabit.stack_id
    const oldHabitStack = habitToUpdate.stack_id

    if (newHabitStack !== oldHabitStack) {
      // update position of habits in the old stack
      habits.forEach(habit => {
        if (habit.stack_id === oldHabitStack && habit.position > habitToUpdate.position) {
          habit.position--
        }
      })
      // put edited habit in the end of the new stack
      habitToUpdate.position = habits.filter(habit => habit.stack_id === newHabitStack).length
    }



    habitToUpdate.title = editedHabit.title
    habitToUpdate.tag_name = editedHabit.tag_name
    habitToUpdate.stack_id = editedHabit.stack_id

    db.write()
    event.sender.send(IPC_CHANNELS.HABITS_UPDATED)
    return { success: true, message: 'Habit updated!' }
  })

  ipcMain.handle(IPC_CHANNELS.TOGGLE_HABIT_COMPLETION, (event, habit: Habit) => {
    db.read()
    const dbHabit = db.data.habits.find(h => h.id === habit.id)
    if (!dbHabit) return { success: false, message: 'Habit not found' }

    const user = db.data.user
    const tag = db.data.tags.find(tag => tag.title === habit.tag_name)
    if (!tag) return { success: false, message: 'Tag not found' }

    const today = getToday()
    const habitCheckedToday = habit.last_month_completed.includes(today)

    // reward for habit completetion
    const reward = getHabitProgressionReward(habit)
    const crystals = reward.crystals + habit.current_streak
    const exp = reward.exp + habit.current_streak

    const userLvlBefore = user.level
    const tagLvlBefore = tag.level
    const tagTitle = tag.title

    // revert changes if habit was checked today
    if (habitCheckedToday) {
      const lastEntryIndex = habit.last_month_completed.length - 1
      dbHabit.last_month_completed.splice(lastEntryIndex, 1)
      dbHabit.counter--
      dbHabit.current_streak--

      // avoid new current_streak subtracting more than the initial habit check rewarded
      user.balance -= crystals - 1

      user.exp_gained -= exp - 1
      user.crystals_gained -= crystals - 1

      //handle level ups
      updateLevel(user, -exp + 1, true);
      updateLevel(tag, -exp + 1, false);
      // add changes if habit was not checked today  
    } else {
      dbHabit.last_month_completed.push(today)
      dbHabit.counter++
      dbHabit.current_streak++

      user.balance += crystals

      user.exp_gained += exp
      user.crystals_gained += crystals

      //handle level ups
      updateLevel(user, exp, true);
      updateLevel(tag, exp, false);
    }

    // check if user leveled up
    let levelUp = false
    if (userLvlBefore < user.level) {
      levelUp = true
    }

    // check if tag leveled up
    let tagLevelUp = false
    if (tagLvlBefore < tag.level) {
      tagLevelUp = true
    }

    // check if habitcounter surpassed 60
    if (dbHabit.counter >= 60) {
      db.data.user.habits_implemented++
    }


    db.write()

    event.sender.send(IPC_CHANNELS.HABITS_UPDATED)
    event.sender.send(IPC_CHANNELS.BALANCE_UPDATED, db.data.user.balance)
    event.sender.send(IPC_CHANNELS.USER_EXP_UPDATED, db.data.user.exp_current, db.data.user.exp_needed)
    event.sender.send(IPC_CHANNELS.USER_LEVEL_UPDATED, db.data.user.level)
    return { success: true, exp, crystals, levelUp, tagLevelUp, tagTitle }
  })

  ipcMain.handle(IPC_CHANNELS.UPDATE_ALL_STREAKS, (event) => {
    db.read()
    const habits = db.data.habits

    const today = getToday()
    const yesterday = getYesterday()


    habits.forEach(habit => {
      const completetionArray = habit.last_month_completed
      const lastCompletionIndex = completetionArray.length - 1
      const lastCompletion = completetionArray[lastCompletionIndex]

      if (lastCompletion === today || lastCompletion === yesterday) {
        return { success: false }

      } else {
        if (habit.best_streak < habit.current_streak) habit.best_streak = habit.current_streak
        habit.current_streak = 0
      }
    })

    event.sender.send(IPC_CHANNELS.HABITS_UPDATED)
    db.write()
    return { success: true }
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
      created_at: getToday(),
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

    db.data.user.rewards_unlocked++

    db.write()

    event.sender.send(IPC_CHANNELS.REWARDS_UPDATED)
    event.sender.send(IPC_CHANNELS.BALANCE_UPDATED, db.data.user.balance)

    return {
      success: true,
      message: 'You unlocked ' + reward.title + '!',
      rewardCost: reward.cost
    }
  })
}