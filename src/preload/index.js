import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_CHANNELS } from '../shared/ipcChannels'

// exposes custom API to renderer process
const api = {
  // Custom window control panel
  windowControl: (action) => ipcRenderer.send('window-control', action),

  // Universal Functions
  moveItem: (item, itemType, direction) => ipcRenderer.invoke(IPC_CHANNELS.MOVE_ITEM, item, itemType, direction),
  getItems: (itemType) => ipcRenderer.invoke(IPC_CHANNELS.GET_ITEMS, itemType),
  deleteItem: (id, itemType) => ipcRenderer.invoke(IPC_CHANNELS.DELETE_ITEM, id, itemType),

  // User Functions
  getBalance: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_BALANCE),
  onBalanceUpdate: (callback) => {
    const handler = (event, newBalance) => callback(newBalance);
    ipcRenderer.on(IPC_CHANNELS.BALANCE_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.BALANCE_UPDATED, handler);
  },

  // Idea Functions
  getIdeas: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_IDEAS),
  addIdea: async (idea) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_IDEA, idea),
  editIdea: async (idea) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_IDEA, idea),
  deleteIdea: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_IDEA, id),
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
  getRewards: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_REWARDS),
  addReward: async (reward) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_REWARD, reward),
  editReward: async (reward) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_REWARD, reward),
  deleteReward: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_REWARD, id),
  moveReward: async (reward) => await ipcRenderer.invoke(IPC_CHANNELS.MOVE_REWARD, reward),
  unlockReward: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.UNLOCK_REWARD, id),
  onRewardsUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.REWARDS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.REWARDS_UPDATED, handler);
  },

  // HabitStack Functions
  getHabitStacks: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_HABIT_STACKS),
  addHabitStack: async (habitStack) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_HABIT_STACK, habitStack),
  editHabitStack: async (habitStack) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_HABIT_STACK, habitStack),
  deleteHabitStack: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_HABIT_STACK, id),
  onHabitStacksUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.HABIT_STACKS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.HABIT_STACKS_UPDATED, handler);
  },

  // Habit Functions
  getHabits: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_HABITS),
  addHabit: async (habit) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_HABIT, habit),
  editHabit: async (habit) => await ipcRenderer.invoke(IPC_CHANNELS.EDIT_HABIT, habit),
  deleteHabit: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_HABIT, id),
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
