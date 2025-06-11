import { ref, toRaw, readonly } from 'vue'
import { useToasts } from './useToasts'
const { addToast } = useToasts()
/**
 * GENERIC EDIT-ITEM COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @var editItemData {object} - The data of the item being edited
 * @var editingId {number} - The id of the item being edited
 * @function startEditing - Populate editing item data - takes an item object
 * @function cancelEditing - Reset editing state
 * @function saveEditing - Save edited item
 * @function deleteEditing - Delete edited item
 * --------------------------------------------------------------------------------------------------------------
 * @param {object} config - Configuration object containing the following properties:
 * @param {function} config.editFn - Async function to edit an item (e.g., (itemData) => editItem(itemData)).
 * @param {function} config.deleteFn - Async function to delete an item by ID (e.g., (itemId) => deleteItem(itemId)).
 */
export function useEdit({
  editFn,
  deleteFn,
}) {
  const editingId = ref(null)
  const editingType = ref(null)
  const editedItemData = ref({})


  const startEditing = (item, type) => {
    editingId.value = item.id
    editedItemData.value = { ...item }
    editingType.value = type
  }

  const cancelEditing = () => {
    editingId.value = null
    editedItemData.value = {}
    editingType.value = null
  }

  const saveEditing = async () => {
    if (editingId.value === null) return
    try {
      const payload = toRaw(editedItemData.value)
      const result = await editFn(payload)
      if (result.success) {
        addToast({ message: result.message, type: 'success' })
      } else {
        addToast({ message: result.message, type: 'error' })
      }
    } catch (error) {
      console.error('Error updating item:', error)
      addToast({ message: 'An error occured...', type: 'error' })
    }
    cancelEditing()
  }

  const deleteEditing = async () => {
    if (editingId.value === null) return
    try{
      const result = await deleteFn(toRaw(editingId.value), toRaw(editingType.value))
      addToast({ message: result.message, type: 'warning' })
    } catch (error) {
      console.error('Error deleting item:', error)
      addToast({ message: 'An error occured...', type: 'error' })
    }
    cancelEditing()
  }

  return {
    editingId: readonly(editingId), // readonly for safety -> ID not editable
    editedItemData, 
    editingType,
    startEditing,
    cancelEditing,
    saveEditing,
    deleteEditing,
  }
}