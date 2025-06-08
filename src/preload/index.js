import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_CHANNELS } from '../shared/ipcChannels'

// exposes custom API to renderer process
const api = {
  // Custom window control panel
  windowControl: (action) => ipcRenderer.send('window-control', action),

  // Balance Functions
  getBalance: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_BALANCE),
  addBalance: async (amount) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_BALANCE, amount),
  removeBalance: async (amount) => await ipcRenderer.invoke(IPC_CHANNELS.REMOVE_BALANCE, amount),
  onBalanceUpdate: (callback) => {
    const handler = (event, newBalance) => callback(newBalance);
    ipcRenderer.on(IPC_CHANNELS.BALANCE_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.BALANCE_UPDATED, handler);
  },

  // Idea Functions
  getIdeas: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_IDEAS),
  addIdea: async (idea) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_IDEA, idea),
  updateIdea: async (idea) => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_IDEA, idea),
  deleteIdea: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_IDEA, id),
  onIdeasUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.IDEAS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.IDEAS_UPDATED, handler);
  },
  
  // Tag Functions
  getTags: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_TAGS),
  addTag: async (tag) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_TAG, tag),
  updateTag: async (tag) => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_TAG, tag),
  deleteTag: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_TAG, id),
  onTagsUpdate: (callback) => {
    const handler = (event, newTags) => callback(newTags);
    ipcRenderer.on(IPC_CHANNELS.TAGS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.TAGS_UPDATED, handler);
  },

  // Reward Functions
  getRewards: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_REWARDS),
  addReward: async () => await ipcRenderer.invoke(IPC_CHANNELS.ADD_REWARD),
  updateReward: async (reward) => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_REWARD, reward),
  deleteReward: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_REWARD, id),
  unlockReward: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.UNLOCK_REWARD, id),
  onRewardsUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.REWARDS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.REWARDS_UPDATED, handler);
  },

  // HabitStack Functions
  getHabitStacks: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_HABIT_STACKS),
  addHabitStack: async (habitStack) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_HABIT_STACK, habitStack),
  updateHabitStack: async (habitStack) => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_HABIT_STACK, habitStack),
  deleteHabitStack: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_HABIT_STACK, id),
  onHabitStacksUpdate: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.HABIT_STACKS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.HABIT_STACKS_UPDATED, handler);
  },

  // Habit Functions
  getHabits: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_HABITS),
  addHabit: async (habit) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_HABIT, habit),
  updateHabit: async (habit) => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_HABIT, habit),
  deleteHabit: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_HABIT, id),
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
