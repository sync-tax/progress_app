<script setup>
import PlusIcon from '../assets/plus.svg'
import EditIcon from '../assets/edit.svg'
import IdeaIcon from '../assets/idea.svg'

import ModuleTitle from '../components/ModuleTitle.vue'

import { onMounted, ref, toRaw } from 'vue'

import { useIdeas } from '../composables/db_functions/useIdeas'
import { useKeydowns } from '../composables/helpers/useKeydowns'

const { fetchIdeas, ideas, deleteIdea, updateIdea, addIdea } = useIdeas()
onMounted(async () => {
  fetchIdeas()
})

//EDIT LOGIC
const editingId = ref(null)
const editedIdea = ref({})

const startEditing = (idea) => {
  editingId.value = idea.id
  //spread operator is used to create a new object (clone)
  editedIdea.value = { ...idea }
}

const cancelEditing = () => {
  //reset reactive references
  editingId.value = null
  editedIdea.value = {}
}

const saveEditing = async () => {
  // just to make sure lol
  if (!editingId.value) return
  // toRaw() is a vue function that removes reactivity from an object
  // this is needed because updateReward() takes an object as a parameter -> doesn't work with reactive objects
  updateIdea(toRaw(editedIdea.value))
  fetchIdeas()
  cancelEditing()
}

const deleteEditing = () => {
  // just to make sure lol
  if (!editingId.value) return
  deleteIdea(editingId.value)
  fetchIdeas()
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
</script>

<template>
  <ModuleTitle title="Ideas" />

  <div id="ideasWrapper" class="moduleWrapper">
    <!-- Idea Card START -->
    <div id="ideaCard" v-for="idea in ideas" :key="idea.id">
      <!-- Normal Template START -->
      <template v-if="editingId !== idea.id">
        <div id="ideaCard">
          <div class="cardWrapper">
            <div class="bulbWrapper">
              <IdeaIcon class="bulb" />
            </div>

            <div class="ideaContent">
              <h4>{{ idea.title }}</h4>
              <p>{{ idea.description }}</p>
            </div>

            <div class="editIconContainer" @click="startEditing(idea)">
              <EditIcon class="editIcon" />
            </div>
          </div>
        </div>
      </template>
      <!-- Normal Template END -->
       
       <!-- Edit Template START -->
      <template v-else>
        <div class="ideaEditWrapper">
          <div>
            <input class="titleInput" type="text" v-model="editedIdea.title">
            <textarea class="descriptionInput" spellcheck="false" v-model="editedIdea.description"></textarea>
          </div>
        </div>
      </template>
      <!-- Edit Template END -->
    </div>
    <!-- Idea Card END -->
    <div class="addIdeaWrapper" @click="addIdea({ title: 'New Idea', description: 'Description' }); fetchIdeas();">
      <PlusIcon class="addIcon" />
    </div>

  </div>
</template>