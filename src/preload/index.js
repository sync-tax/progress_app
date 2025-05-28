import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Custom window control panel
  windowControl: (action) => ipcRenderer.send('window-control', action),

  // Balance Functions
  getBalance: async () => await ipcRenderer.invoke('get-balance'),

  // Tag Functions
  getTags: async () => await ipcRenderer.invoke('get-tags'),
  addTag: async (tag) => await ipcRenderer.invoke('add-tag', tag),
  updateTag: async (tag) => await ipcRenderer.invoke('update-tag', tag),
  deleteTag: async (id) => await ipcRenderer.invoke('delete-tag', id),
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
