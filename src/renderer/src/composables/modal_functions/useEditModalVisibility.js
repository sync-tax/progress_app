import { ref } from 'vue'

export function useEditModalVisibility(refreshCallback = null) {
  const isVisible = ref(false)
  const editedData = ref(null)

  const showModal = (data) => {
    editedData.value = data
    isVisible.value = true
  }

  const hideModal = async () => {
    isVisible.value = false
    if (refreshCallback && typeof refreshCallback === 'function') {
      await refreshCallback()
    }
  }

  return {
    isVisible,
    editedData,
    showModal,
    hideModal
  }
}