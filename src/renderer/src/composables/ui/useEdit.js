import { ref, toRaw, readonly } from 'vue'

/**
 * A composable for managing inline editing logic.
 * @param {object} config
 * @param {function} config.updateFn - Async function to update an item (e.g., (itemData) => updateReward(itemData)).
 * @param {function} config.deleteFn - Async function to delete an item by ID (e.g., (itemId) => deleteReward(itemId)).
 * @param {function} config.fetchFn - Async function to refresh the list of items (e.g., () => getRewards()).
 * @param {string} [config.idKey='id'] - The key used for the item's ID.
 * @param {function} [config.onSaveSuccess] - Optional async function to call after a successful save.
 * @param {function} [config.onDeleteSuccess] - Optional async function to call after a successful delete.
 */
export function useInlineEditor({
  updateFn,
  deleteFn,
  fetchFn,
  idKey = 'id',
  onSaveSuccess,
  onDeleteSuccess
}) {
  const editingId = ref(null)
  const editedItemData = ref({})

  const startEditing = (item) => {
    editingId.value = item[idKey]
    editedItemData.value = { ...item }
  }

  const cancelEditing = () => {
    editingId.value = null
    editedItemData.value = {}
  }

  const saveEditing = async () => {
    if (editingId.value === null) return // Check against null, as ID could be 0

    await updateFn(toRaw(editedItemData.value))
    if (onSaveSuccess) {
      await onSaveSuccess(toRaw(editedItemData.value));
    }
    await fetchFn()
    cancelEditing()
  }

  const deleteEditing = async () => {
    if (editingId.value === null) return
    const deletedItemId = editingId.value; // Store id before cancelling

    await deleteFn(editingId.value)
    if (onDeleteSuccess) {
      await onDeleteSuccess(deletedItemId);
    }
    await fetchFn()
    cancelEditing()
  }

  return {
    editingId: readonly(editingId), // Expose as readonly for safety -> thats what Gemini said lol
    editedItemData, 

    startEditing,
    cancelEditing,
    saveEditing,
    deleteEditing,
  }
}