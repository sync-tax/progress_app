<script setup>
// ========== IMPORTS ==========
// Icons
import PlusIcon from '../assets/plus.svg'

// Components
import ModuleTitle from '../components/ModuleTitle.vue'
import Card from '../components/Card.vue'
import EditItem from '../components/EditItem.vue'

// Composables
import { useIdeas } from '../composables/db_functions/useIdeas'
import { useKeydowns } from '../composables/helpers/useKeydowns'
import { useToasts } from '../composables/ui/useToasts'
import { useInlineEditor } from '../composables/ui/useEdit'

// Vue
import { onMounted, onUnmounted, toRaw } from 'vue'

// ========== DATA ==========
const { getIdeas, ideas, deleteIdea, updateIdea, addIdea: addIdeaLogic, onIdeasUpdate } = useIdeas()
const { addToast } = useToasts()

let cleanupIdeaUpdate = null

// ========== LIFECYCLE ========== 
onMounted(async () => {
  await getIdeas()

  cleanupIdeaUpdate = onIdeasUpdate(() => {
    getIdeas()
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
} = useInlineEditor({
  updateFn: updateIdea,
  deleteFn: deleteIdea,
  fetchFn: getIdeas,
  onSaveSuccess: () => {
    addToast({ message: 'Saved Idea.', type: 'success' });
  },
  onDeleteSuccess: () => {
    addToast({ message: 'Deleted Idea.', type: 'warning' });
  }
});

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
    <div id="ideaCard" v-for="idea in ideas" :key="idea.id">
      <!-- Normal Template START -->
      <template v-if="editingId !== idea.id">
         <Card
          :itemData="idea" 
          :itemType="'idea'" 
          @start-edit="startEditing(idea)"
        />
      </template>
      <!-- Normal Template END -->
       
       <!-- Edit Template START -->
      <template v-else>
        <EditItem 
          :itemType="'idea'" 
          v-model="editedItemData" 
          @save="saveEditing"
          @cancel="cancelEditing"
          @delete="deleteEditing"
        />
      </template>
      <!-- Edit Template END -->
    </div>
    <!-- Idea Card END -->
    <div class="addIdeaWrapper" @click="addIdea()">
      <PlusIcon class="addIcon" />
    </div>

  </div>
</template>