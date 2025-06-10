<script setup>
// ========== IMPORTS ==========
// Icons
import PlusIcon from '../assets/plus.svg'
// Components
import ModuleTitle from '../components/ModuleTitle.vue'
import Card from '../components/Card.vue'
import EditItem from '../components/EditItem.vue'
// Composables
import { useTags } from '../composables/db_functions/useTags'
import { useToasts } from '../composables/ui/useToasts'
import { useEdit } from '../composables/ui/useEdit'
// Vue
import { onMounted, onUnmounted, toRaw } from 'vue'

// ========== DATA ==========
const { getTags, tags, deleteTag, updateTag, addTag: addTagLogic, onTagsUpdate } = useTags()
const { addToast } = useToasts()

let cleanupTagsUpdate = null

// ========== LIFECYCLE ==========
onMounted(async () => {
  await getTags()

  cleanupTagsUpdate = onTagsUpdate(() => {
    getTags()
  })
})

onUnmounted(() => {
  if (cleanupTagsUpdate) {
    cleanupTagsUpdate()
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
  editFn: updateTag,
  deleteFn: deleteTag,
});

// ========== FUNCTIONS ========== 
const addTag = async () => {
  try {
    const result = await addTagLogic(); // returns { success: boolean, message: string, newTag: object }
    //check if all return values arrived
    if (result.success) {
      //jump to editmode
      startEditing(toRaw(result.newTag));
      addToast({ message: result.message, type: 'info' });
    } else {
      addToast({ message: 'Failed to add tag.', type: 'error' });
    }
  } catch (error) {
    console.error('Error adding tag:', error)
    addToast({ message: 'An error occured', type: 'error' })
  }
}
</script>

<template>
  <ModuleTitle title="Tags" />

  <div id="tagsWrapper" class="moduleWrapper">
    <div v-for="tag in tags" :key="tag.id" id="tagCard">
      <!-- Render Card if not editing this specific tag -->
      <template v-if="editingId !== tag.id">
        <Card
          :itemData="tag" 
          :itemType="'tag'" 
          @start-edit="startEditing(tag)"
        />
      </template>

      <!-- Render EditItem if editing this specific tag -->
      <template v-else>
        <EditItem 
          :itemType="'tag'" 
          v-model="editedItemData" 
          @save="saveEditing"
          @cancel="cancelEditing"
          @delete="deleteEditing"
        />
      </template>
    </div>
    <div class="addTagWrapper" @click="addTag()">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>