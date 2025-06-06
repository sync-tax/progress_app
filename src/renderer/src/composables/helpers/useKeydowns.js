import { onMounted, onUnmounted } from 'vue'

export function useKeydowns({ onSave, onCancel, onDelete }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSave?.()
    if (e.key === 'Escape') onCancel?.()
    if (e.key === 'Delete') onDelete?.()
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}
