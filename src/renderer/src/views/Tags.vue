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
import { useTags } from '../composables/db_functions/useTags'
import { useAdd } from '../composables/ui/useAdd'
import { useEdit } from '../composables/ui/useEdit'
import { useSort } from '../composables/ui/useSort'
// Vue
import { onMounted, onUnmounted } from 'vue'

// ========== DATA ==========
const {editTag, addTag, onTagsUpdate } = useTags()
const { items, getItems, deleteItem, moveItem } = useUniversals()
const { sortByPosition } = useSort()

let cleanupTagsUpdate = null

// ========== LIFECYCLE ==========
onMounted(() => {
  getItems('tags')

  cleanupTagsUpdate = onTagsUpdate(() => {
    getItems('tags')
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
  editFn: editTag,
  deleteFn: deleteItem,
});

// ========== ADDER CONFIGS ==========
const {
  isAdding,
  addedItemData,
  startAdding,
  cancelAdding,
  saveAdding
} = useAdd({
  addFn: addTag,
  itemType: 'tags'
})
</script>

<template>
  <ModuleTitle title="Tags" />

  <div id="tagsWrapper" class="moduleWrapper">
    <div v-for="tag in sortByPosition(items)" :key="tag.id" id="tagCard">
      <!-- Show Card if not editing this specific tag -->
      <template v-if="editingId !== tag.id">
        <Card
          :itemData="tag" 
          :itemType="'tags'" 
          @start-edit="startEditing(tag, 'tags')"
          @move-item="moveItem(tag, 'tags', $event)"
        />
      </template>

      <!-- Show EditItem if editing this specific tag -->
      <template v-else>
        <EditItem 
          :itemType="'tags'" 
          v-model="editedItemData" 
          @save-edit="saveEditing"
          @cancel-edit="cancelEditing"
          @delete-edit="deleteEditing"
        />
      </template>
    </div>
    <!-- Show AddIcon -->
    <template v-if="!isAdding">
      <div class="addTagWrapper" @click="startAdding()">
        <PlusIcon class="addIcon" />
      </div>
    </template>
    <!-- Show AddItem if adding button is clicked -->
    <template v-else>
      <AddItem :itemType="'tags'" v-model="addedItemData" @save-add="saveAdding()" @cancel-add="cancelAdding()" />
    </template>
  </div>
</template>