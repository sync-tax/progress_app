import { onMounted, onUnmounted } from 'vue'

export function useModalActions({ onSave, onCancel }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSave?.()
    if (e.key === 'Escape') onCancel?.()
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}
