<script setup>
import IdeaIcon from '../../assets/idea.svg'

import { computed } from 'vue'

const props = defineProps({
    idea: {
        type: Object,
        required: true
    }
})

const rank = computed(() => {
    if (props.idea.rank === 'legendary') return 'legendary'
    else if (props.idea.rank === 'epic') return 'epic'
    else if (props.idea.rank === 'rare') return 'rare'
    else if (props.idea.rank === 'uncommon') return 'uncommon'
    else return 'common'
})

</script>

<template>
  <div class="ideaCard">
    <div class="rankColor" :class="rank"> 
      <IdeaIcon class="bulb" />
    </div>

    <div class="ideaContent">
      <h4>{{ idea.title }}</h4>
      <p>{{ idea.description }}</p>
    </div>
  </div>
</template>