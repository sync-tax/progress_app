<script setup>
import TagIcon from '../../assets/tags.svg'
import EditIcon from '../../assets/edit.svg'

import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: Object,
    required: true
  }
})

const rank = computed(() => {
  if (props.tag.level >= 55) return 'legendary'
  else if (props.tag.level >= 40) return 'epic'
  else if (props.tag.level >= 25) return 'rare'
  else if (props.tag.level >= 10) return 'uncommon'
  else return 'common'
})


const emit = defineEmits(['edit'])

const renderEditModal = (tag) => {
    emit('edit', tag)
}

</script>

<template>
  <div id="tagCard" class="cardWrapper" :class="rank + '-opac'">
    <div class="rankColor" :class="rank">
      <TagIcon class="hashtag" />
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

      <div class="editIconContainer" @click="renderEditModal(tag)">
        <EditIcon class="editIcon" />
      </div>

      <progress class="expBar" :class="rank" :value="tag.exp_current" :max="tag.exp_needed">
        EXP
      </progress>
    </div>
  </div>
</template>
