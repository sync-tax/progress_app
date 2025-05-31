<script setup>
import PlusIcon from '../assets/plus.svg'

import TagCard from '../components/cards/TagCard.vue'
import AddModal from '../components/modals/AddModal.vue'
import EditModal from '../components/modals/EditModal.vue'

import { ref, onMounted, computed } from 'vue'

const tags = ref([])
const fetchTags = async () => {
  tags.value = await window.api.getTags()
}

onMounted(async () => {
  fetchTags()
})

const sortedTags = computed(() =>
  tags.value.slice().sort((a, b) => b.level - a.level)
)

// Form Visibility
const addFormIsVisible = ref(false)
const renderAddForm = () => {
  addFormIsVisible.value = true
}

const closeAddForm = async () => {
  addFormIsVisible.value = false
  await fetchTags()
}

const editingTag = ref(null)
const editFormIsVisible = ref(false)
const renderEditModal = (tag) => {
  editingTag.value = tag
  editFormIsVisible.value = true
}

const closeEditModal = async () => {
  editFormIsVisible.value = false
  await fetchTags()
}
</script>

<template>
  <div class="moduleTitle">
    <h1>
      Tags
    </h1>
  </div>

  <div class="tagsWrapper">
    <TagCard v-for="tag in sortedTags" :key="tag.id" :tag="tag" @edit="renderEditModal(tag)" />
    <div class="addTagWrapper" @click="renderAddForm()">
      <PlusIcon class="addIcon" />
    </div>
  </div>
  <AddModal v-if="addFormIsVisible" type="tag" @close="closeAddForm()" />
  <EditModal v-if="editFormIsVisible && editingTag" type="tag" :data="editingTag" @close="closeEditModal()" />
</template>