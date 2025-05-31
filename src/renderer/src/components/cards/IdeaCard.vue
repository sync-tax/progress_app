<script setup>
import IdeaIcon from '../../assets/idea.svg'
import EditIcon from '../../assets/edit.svg'

import { computed } from 'vue'

const props = defineProps({
    idea: {
        type: Object,
        required: true
    }
})

const rankHoverStyle = computed(() => {
  return props.idea.rank + '-opac'
})

const emit = defineEmits(['edit'])

const renderEditModal = (idea) => {
    emit('edit', idea)
}

</script>

<template>
  <div class="ideaCard" :class="rankHoverStyle">
    <div class="rankColor" :class="props.idea.rank"> 
      <IdeaIcon class="bulb" />
    </div>

    <div class="ideaContent">
      <h4>{{ idea.title }}</h4>
      <p>{{ idea.description }}</p>
    </div>

    <div class="editIconContainer" @click="renderEditModal(idea)">
      <EditIcon class="editIcon" />
    </div>
  </div>
</template>
