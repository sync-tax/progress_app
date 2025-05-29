<script setup>
import PlusIcon from '../assets/plus.svg'

import IdeaCard from '../components/IdeaCard.vue'

import { ref, onMounted } from 'vue'

const ideas = ref([])
const fetchIdeas = async () => {
  ideas.value = await window.api.getIdeas()
}

onMounted(async () => {
  fetchIdeas()
})

</script>

<template>
  <div class="moduleTitle">
    <h1>Ideas</h1>
  </div>


  <div class="ideasWrapper">
    <IdeaCard v-for="idea in ideas" :key="idea.id" :idea="idea" />
    <div class="addIdeaWrapper">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>