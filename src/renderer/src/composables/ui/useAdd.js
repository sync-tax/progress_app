import { ref, toRaw } from 'vue'
import { useToasts } from './useToasts'
const { addToast } = useToasts()
/**
 * GENERIC ADD-ITEM COMPOSABLE
 * --------------------------------------------------------------------------------------------------------------
 * @var addedItemData {object} - The data of the item being added
 * @var isAdding {boolean} - Whether the adding state is active
 * @function startAdding - Activate adding state
 * @function cancelAdding - Deactivate adding state
 * @function saveAdding - Save added item
 * --------------------------------------------------------------------------------------------------------------
 * @param {object} config - Configuration object containing the following properties:
 * @param {function} config.addFn - Async function to add an item (e.g., (itemData) => addItem(itemData)).
 * @param {string} config.itemType - The type of item being added (e.g., 'reward', 'tag').
 */
export function useAdd({
  addFn,
  itemType,
}) { 
  const isAdding = ref(false)
  const addedItemData = ref({})
  const activeListId = ref(null)

  const startAdding = (listId = null) => {
    addedItemData.value = { ...constructPayload(itemType) }
    isAdding.value = true
    if (listId) activeListId.value = listId
  }

  const cancelAdding = () => {
    isAdding.value = false
    addedItemData.value = {}
    if (activeListId.value) activeListId.value = null
  }

  const saveAdding = async () => {
    try {
      const payload = toRaw(addedItemData.value)
      const result = await addFn(payload)
      if (result.success) {
        addToast({ message: result.message, type: 'success' })
      } else {
        addToast({ message: result.message, type: 'error' })
        return
      }
    } catch (error) {
      console.error('Error adding item:', error)
      addToast({ message: 'An error occured...', type: 'error' })
    }
    cancelAdding()
  }

  return {
    isAdding,
    addedItemData,
    activeListId,
    startAdding,
    cancelAdding,
    saveAdding,
  }
}

/**
 * HELPER FUNCTION
 * Constructs a payload based on the item type.
 * @param {string} itemType - The type of item (e.g., 'reward', 'tag').
 * @returns {object} - The constructed payload.
 */
const constructPayload = (itemType) => {
    switch (itemType) {
      case 'rewards':
        return {
          title: '',
          cost: 0,
          repeatable: false,
        }
      case 'tags':
        return {
          title: ''
        }
      case 'habit_stacks':
        return {
          title: ''
        }
      case 'ideas':
        return {
          title: '',
          description: ''
        }
      case 'habits':
        return {
          title: '',
          tag_name: null,
          stack_id: null
        }
      default:
        console.warn(`Unknown itemType: ${itemType}.`)
        return null
    }
}