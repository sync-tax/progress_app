<script setup>
import PlusIcon from '../assets/plus.svg'
import EditIcon from '../assets/edit.svg'

import ModuleTitle from '../components/ModuleTitle.vue'

import { useKeydowns } from '../composables/helpers/useKeydowns'
import { useTags } from '../composables/db_functions/useTags'

import { onMounted, ref, toRaw } from 'vue'

const { fetchTags, tags, deleteTag, updateTag, addTag } = useTags()
onMounted(async () => {
  fetchTags()
})

//EDIT LOGIC
const editingId = ref(null)
const editedTag = ref({})

const startEditing = (tag) => {
  editingId.value = tag.id
  //spread operator is used to create a new object (clone)
  editedTag.value = { ...tag }
}

const cancelEditing = () => {
  //reset reactive references
  editingId.value = null
  editedTag.value = {}
}

const saveEditing = async () => {
  // just to make sure lol
  if (!editingId.value) return
  // toRaw() is a vue function that removes reactivity from an object
  // this is needed because updateReward() takes an object as a parameter -> doesn't work with reactive objects
  updateTag(toRaw(editedTag.value))
  fetchTags()
  cancelEditing()
}

const deleteEditing = () => {
  // just to make sure lol
  if (!editingId.value) return
  deleteTag(editingId.value)
  fetchTags()
  cancelEditing()
}

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
          <input class="titleInput" type="text" v-model="editedTag.title">
        </div>
      </template>
      <!-- Edit Template END -->
    </div>
    <!-- Reward Card END -->
    <div class="addTagWrapper" @click="addTag({ title: 'New Tag', level: 1, exp_current: 0, exp_needed: 60 }); fetchTags();">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>