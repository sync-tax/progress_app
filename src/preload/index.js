import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_CHANNELS } from '../shared/ipcChannels'

// exposes custom API to renderer process
const api = {
  // Custom window control panel
  windowControl: (action) => ipcRenderer.send('window-control', action),

  // Universal Functions
  getItems: (itemType) => ipcRenderer.invoke(IPC_CHANNELS.GET_ITEMS, itemType),
  deleteItem: (id, itemType) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_ITEM, id, itemType),
  moveItem: (item, itemType, direction) => ipcRenderer.invoke(IPC_CHANNELS.MOVE_ITEM, item, itemType, direction),

  // User Functions
  getBalance: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_BALANCE),
  onBalanceUpdate: (callback) => {
    const handler = (event, newBalance) => callback(newBalance);
    ipcRenderer.on(IPC_CHANNELS.BALANCE_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.BALANCE_UPDATED, handler);
  },
  getUserExp: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_USER_EXP),
  onUserExpUpdate: (callback) => {
    const handler = (event, newExpCurrent, newExpNeeded) => callback(newExpCurrent, newExpNeeded);
    ipcRenderer.on(IPC_CHANNELS.USER_EXP_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.USER_EXP_UPDATED, handler);
  },
  getUserLevel: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_USER_LEVEL),
  onUserLevelUpdate: (callback) => {
    const handler = (event, newLevel) => callback(newLevel);
    ipcRenderer.on(IPC_CHANNELS.USER_LEVEL_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.USER_LEVEL_UPDATED, handler);
  },

  // Project Functions
  addProject: async (project) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_PROJECT, project),
  editProject: async (project) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_PROJECT, project),
  onProjectsUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.PROJECTS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.PROJECTS_UPDATED, handler);
  },

  // Idea Functions
  addIdea: async (idea) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_IDEA, idea),
  editIdea: async (idea) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_IDEA, idea),
  convertIdeaToProject: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.CONVERT_IDEA_TO_PROJECT, id),
  onIdeasUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.IDEAS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.IDEAS_UPDATED, handler);
  },
  
  // Tag Functions
  addTag: async (tag) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_TAG, tag),
  editTag: async (tag) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_TAG, tag),
  onTagsUpdate: (callback) => {
    const handler = (event, newTags) => callback(newTags);
    ipcRenderer.on(IPC_CHANNELS.TAGS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.TAGS_UPDATED, handler);
  },

  // Reward Functions
  addReward: async (reward) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_REWARD, reward),
  editReward: async (reward) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_REWARD, reward),
  unlockReward: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.UNLOCK_REWARD, id),
  onRewardsUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.REWARDS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.REWARDS_UPDATED, handler);
  },

  // HabitStack Functions
  addHabitStack: async (habitStack) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_HABIT_STACK, habitStack),
  editHabitStack: async (habitStack) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_HABIT_STACK, habitStack),
  onHabitStacksUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.HABIT_STACKS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.HABIT_STACKS_UPDATED, handler);
  },

  // Habit Functions
  addHabit: async (habit) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_HABIT, habit),
  editHabit: async (habit) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_HABIT, habit),
  moveNestedHabit: async (habit, direction) => await ipcRenderer.invoke(IPC_CHANNELS.MOVE_NESTED_HABIT, habit, direction),
  toggleHabitCompletion: async (habitId) => await ipcRenderer.invoke(IPC_CHANNELS.TOGGLE_HABIT_COMPLETION, habitId),
  updateAllStreaks: async () => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_ALL_STREAKS),
  onHabitsUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.HABITS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.HABITS_UPDATED, handler);
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
