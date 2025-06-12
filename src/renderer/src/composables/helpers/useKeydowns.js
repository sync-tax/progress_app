import { onMounted, onUnmounted } from 'vue'

/**
 * KEYDOWN COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @param {function} config.onSave - Function to be called when Enter is pressed.
 * @param {function} config.onCancel - Function to be called when Escape is pressed.
 * @param {function} config.onDelete - Function to be called when Delete is pressed.
 */
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
