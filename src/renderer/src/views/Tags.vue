<script setup>
import PlusIcon from '../assets/plus.svg'
import EditIcon from '../assets/edit.svg'

import ModuleTitle from '../components/ModuleTitle.vue'

import { useKeydowns } from '../composables/helpers/useKeydowns'
import { useTags } from '../composables/db_functions/useTags'
import { useToasts } from '../composables/ui/useToasts'
import { useInlineEditor } from '../composables/ui/useEdit'

import { onMounted, onUnmounted, toRaw } from 'vue'

let cleanupTagsUpdate = null

const { getTags, tags, deleteTag, updateTag, addTag: addTagLogic, onTagsUpdate } = useTags()
const { addToast } = useToasts()

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

// USE EDITOR
const { 
  editingId, 
  editedItemData, 
  startEditing, 
  cancelEditing, 
  saveEditing, 
  deleteEditing 
} = useInlineEditor({
  updateFn: updateTag,
  deleteFn: deleteTag,
  fetchFn: getTags,
  onSaveSuccess: () => {
    addToast({ message: 'Saved Tag.', type: 'success' });
  },
  onDeleteSuccess: () => {
    addToast({ message: 'Deleted Tag.', type: 'warning' });
  }
});

//Who needs Buttons in a MVP?
useKeydowns({
  onSave: () => {
    saveEditing()
  },
  onCancel: () => {
    cancelEditing()
  },
  onDelete: () => {
    deleteEditing()
  }
})

//RANK LOGIC
const getRank = (tag) => {
  if (tag.level >= 55) return 'legendary'
  else if (tag.level >= 40) return 'epic'
  else if (tag.level >= 25) return 'rare'
  else if (tag.level >= 10) return 'uncommon'
  else return 'common'
}

const addTag = async () => {
  const result = await addTagLogic();
  //check if all return values arrived
  if (result && result.success && result.newTag) {
    startEditing(toRaw(result.newTag));
    addToast({ message: result.message, type: 'info' }); 
  } else {
    addToast({ message: 'Failed to add tag.', type: 'error' });
  }
}
</script>

<template>
  <ModuleTitle title="Tags" />

  <div id="tagsWrapper" class="moduleWrapper">
    <!-- Reward Card START -->
    <div v-for="tag in tags" :key="tag.id" id="tagCard">
      <!-- Normal Template START -->
      <template v-if="editingId !== tag.id">
        <div class="cardWrapper">
          <div class="rankGems">
            <img v-if="getRank(tag) == 'legendary'" src="../assets/LEGENDARY_MARK.png" alt="tagIcon" class="rankMark" :class="getRank(tag) + '-glow'">
            <img v-if="getRank(tag) == 'epic'" src="../assets/EPIC_MARK.png" alt="tagIcon" class="rankMark" :class="getRank(tag) + '-glow'">
            <img v-if="getRank(tag) == 'rare'" src="../assets/RARE_MARK.png" alt="tagIcon" class="rankMark" :class="getRank(tag) + '-glow'">
            <img v-if="getRank(tag) == 'uncommon'" src="../assets/UNCOMMON_MARK.png" alt="tagIcon" class="rankMark" :class="getRank(tag) + '-glow'">
            <img v-if="getRank(tag) == 'common'" src="../assets/COMMON_MARK.png" alt="tagIcon" class="rankMark" :class="getRank(tag) + '-glow'">
          </div>
          <div class="tagContent">
            <div class="labelLvlWrapper">
              <h4 class="tagLabel">
                {{ tag.title }}
              </h4>
              <p class="tagLvl">
                Level {{ tag.level }}
              </p>
            </div>
            <progress class="expBar" :value="tag.exp_current" :max="tag.exp_needed">
              EXP
            </progress>
          </div>
          <div class="editIconContainer" @click="startEditing(tag)">
            <EditIcon class="editIcon" />
          </div>
        </div>
      </template>
      <!-- Normal Template END -->
      <!-- Edit Template START -->
      <template v-else>
        <div class="tagEditWrapper">
          <input class="titleInput" type="text" v-model="editedItemData.title">
        </div>
      </template>
      <!-- Edit Template END -->
    </div>
    <!-- Reward Card END -->
    <div class="addTagWrapper" @click="addTag()">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>