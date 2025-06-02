// src/composables/useTags.js
import { ref, computed } from 'vue'

export function useTags() {
  const tags = ref([])

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

  const sortedTags = computed(() =>
    tags.value.slice().sort((a, b) => b.level - a.level)
  )

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

