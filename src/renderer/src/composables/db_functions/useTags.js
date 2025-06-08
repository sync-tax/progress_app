// ========== COMPOABLE PROVIDING DATABASE FUNCTIONS FOR TAGS ========== 
import { ref } from 'vue'

export function useTags() {
  // initiates tag array
  const tags = ref([])
 // initiates tag data - empty by default
  const tagData = ref({
    title: ''
  })

  const getTags = async () => {
    tags.value = await window.api.getTags()
  }

  const addTag = async (tag) => {
    return await window.api.addTag(tag)
  }

  const updateTag = async (tag) => {
    return await window.api.updateTag(tag)
  }

  const deleteTag = async (id) => {
    return await window.api.deleteTag(id)
  }

  const onTagsUpdate = (callback) => {
    return window.api.onTagsUpdate(callback)
  }
// exposes component functions
  return {
    tags,
    tagData,
    getTags,
    addTag,
    updateTag,
    deleteTag,
    onTagsUpdate
  }
}

