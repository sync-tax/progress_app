<script setup>
import PlusIcon from '../assets/plus.svg'

import IdeaCard from '../components/cards/IdeaCard.vue'
import AddModal from '../components/modals/AddModal.vue'
import EditModal from '../components/modals/EditModal.vue'

import { ref, onMounted } from 'vue'

const ideas = ref([])
const fetchIdeas = async () => {
  ideas.value = await window.api.getIdeas()
}

onMounted(async () => {
  fetchIdeas()
})

const addFormIsVisible = ref(false)

const renderAddForm = () => {
  addFormIsVisible.value = true
}

const closeAddForm = () => {
  addFormIsVisible.value = false
  fetchIdeas()
}

const editFormIsVisible = ref(false)
const editingIdea = ref(null)
const renderEditModal = (idea) => {
  editingIdea.value = idea
  editFormIsVisible.value = true
}

const closeEditModal = () => {
  editFormIsVisible.value = false
  fetchIdeas()
}

</script>

<template>
  <div class="moduleTitle">
    <h1>Ideas</h1>
  </div>


  <div id="ideasWrapper" class="moduleWrapper">
    <IdeaCard v-for="idea in ideas" :key="idea.id" :idea="idea" @edit="renderEditModal(idea)" />
    <div class="addIdeaWrapper" @click="renderAddForm()">
      <PlusIcon class="addIcon" />
    </div>
  </div>

  <AddModal v-if="addFormIsVisible" type="idea" @close="closeAddForm()" />
  <EditModal v-if="editFormIsVisible && editingIdea" type="idea" :data="editingIdea" @close="closeEditModal()" />
</template>