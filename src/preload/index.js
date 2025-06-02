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
    ipcRenderer.on(IPC_CHANNELS.BALANCE_UPDATED, (event, newBalance) => callback(newBalance))
  },

  // Idea Functions
  getIdeas: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_IDEAS),
  addIdea: async (idea) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_IDEA, idea),
  updateIdea: async (idea) => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_IDEA, idea),
  deleteIdea: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_IDEA, id),
  
  // Tag Functions
  getTags: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_TAGS),
  addTag: async (tag) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_TAG, tag),
  updateTag: async (tag) => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_TAG, tag),
  deleteTag: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_TAG, id),

  // Reward Functions
  getRewards: async () => await ipcRenderer.invoke(IPC_CHANNELS.GET_REWARDS),
  addReward: async (reward) => await ipcRenderer.invoke(IPC_CHANNELS.ADD_REWARD, reward),
  updateReward: async (reward) => await ipcRenderer.invoke(IPC_CHANNELS.UPDATE_REWARD, reward),
  deleteReward: async (id) => await ipcRenderer.invoke(IPC_CHANNELS.DELETE_REWARD, id),
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
