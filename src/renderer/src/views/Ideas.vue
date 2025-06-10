<script setup>
// ========== IMPORTS ==========
// Icons
import PlusIcon from '../assets/plus.svg'

// Components
import ModuleTitle from '../components/ModuleTitle.vue'
import Card from '../components/Card.vue'
import EditItem from '../components/EditItem.vue'
import AddItem from '../components/AddItem.vue'

// Composables
import { useUniversals } from '../composables/db_functions/useUniversals'
import { useIdeas } from '../composables/db_functions/useIdeas'
import { useToasts } from '../composables/ui/useToasts'
import { useEdit } from '../composables/ui/useEdit'
import { useAdd } from '../composables/ui/useAdd'
import { useSort } from '../composables/ui/useSort'

// Vue
import { onMounted, onUnmounted, toRaw } from 'vue'

// ========== DATA ==========
const { items, getItems, deleteItem, moveItem } = useUniversals()
const { updateIdea, addIdea: addIdeaLogic, onIdeasUpdate } = useIdeas()
const { addToast } = useToasts()
const { sortByPosition } = useSort()

let cleanupIdeaUpdate = null

// ========== LIFECYCLE ========== 
onMounted(async () => {
  await getItems('ideas')

  cleanupIdeaUpdate = onIdeasUpdate(() => {
    getItems('ideas')
  })
})

onUnmounted(() => {
  if (cleanupIdeaUpdate) {
    cleanupIdeaUpdate()
  }
})

// ========== EDITOR CONFIGS ========== 
const { 
  editingId, 
  editedItemData, 
  startEditing, 
  cancelEditing, 
  saveEditing, 
  deleteEditing 
} = useEdit({
  editFn: updateIdea,
  deleteFn: deleteItem,
})

// ========== ADDER CONFIGS ========== 
const {
  isAdding,
  addedItemData,
  startAdding,
  cancelAdding,
  saveAdding
} = useAdd({
  addFn: addIdeaLogic,
  itemType: 'ideas'
})

// ========== FUNCTIONS ========== 
const addIdea = async () => {
  try {
    const result = await addIdeaLogic();
    if (result.success) {
      //starts edit on new idea
      startEditing(toRaw(result.newIdea));
      addToast({ message: result.message, type: 'info' });
    } else {
      addToast({ message: 'Failed to add idea.', type: 'error' });
    }
  } catch (error) {
    console.error('Error adding idea:', error)
    addToast({ message: 'An error occured', type: 'error' })
  }
}
</script>

<template>
  <ModuleTitle title="Ideas" />

  <div id="ideasWrapper" class="moduleWrapper">
    <!-- Idea Card START -->
    <div id="ideaCard" v-for="idea in sortByPosition(items)" :key="idea.id">
      <!-- Normal Template START -->
      <template v-if="editingId !== idea.id">
         <Card
          :itemData="idea" 
          :itemType="'ideas'" 
          @start-edit="startEditing(idea, 'ideas')"
          @move-item="moveItem(idea, 'ideas', $event)"
        />
      </template>
      <!-- Normal Template END -->
       
       <!-- Edit Template START -->
      <template v-else>
        <EditItem 
          :itemType="'ideas'" 
          v-model="editedItemData" 
          @save-edit="saveEditing"
          @cancel-edit="cancelEditing"
          @delete-edit="deleteEditing"
        />
      </template>
      <!-- Edit Template END -->
    </div>
    <!-- Idea Card END -->
    <template v-if="!isAdding">
      <div class="addIdeaWrapper" @click="startAdding()">
        <PlusIcon class="addIcon" />
      </div>
    </template>
    <!-- Show AddItem if adding button is clicked -->
    <template v-else>
      <AddItem :itemType="'ideas'" v-model="addedItemData" @save-add="saveAdding()" @cancel-add="cancelAdding()" />
    </template>

  </div>
</template>