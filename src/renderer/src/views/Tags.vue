<script setup>
import PlusIcon from '../assets/plus.svg'
import TagCard from '../components/TagCard.vue'

import { ref, onMounted } from 'vue'

const tags = ref([])

onMounted(async () => {
  tags.value = await window.api.getTags()
})


</script>

<template>
  <div class="moduleTitle">
    <h1>
      Tags
    </h1>
  </div>

  <div class="tagsWrapper">
    <TagCard v-for="tag in tags" :key="tag.id" :tag="tag" />
    <div class="addTagWrapper">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>