import { ref } from 'vue'

export function useAddModalVisibility(refreshCallback = null) {
  const isVisible = ref(false)

  const showModal = () => {
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
    showModal,
    hideModal
  }
}