import { ref, computed } from 'vue'

export function useTags() {
  // initiates tag array
  const tags = ref([])
 // initiates tag data - empty by default
  const tagData = ref({
    title: ''
  })

  const fetchTags = async () => {
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
// sorts tags by level - descending order
  const sortedTags = computed(() =>
    tags.value.slice().sort((a, b) => b.level - a.level)
  )
// exposes component functions
  return {
    tags,
    tagData,
    fetchTags,
    addTag,
    updateTag,
    deleteTag,
    sortedTags
  }
}

