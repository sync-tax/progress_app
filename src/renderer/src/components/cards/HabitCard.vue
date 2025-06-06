<script setup>
import EditIcon from '../../assets/edit.svg'
import PlusIcon from '../../assets/plus.svg'

import { computed } from 'vue'

const props = defineProps({
    habit: {
        type: Object,
        required: true
    }
})

const rank = computed(() => {
    if (props.habit.best_streak * props.habit.counter >= 3000) return 'legendary'
    else if (props.habit.best_streak * props.habit.counter >= 1250) return 'epic'
    else if (props.habit.best_streak * props.habit.counter >= 500) return 'rare'
    else if (props.habit.best_streak * props.habit.counter >= 100) return 'uncommon'
    else return 'common'
})

const emit = defineEmits(['edit', 'update-and-delete'])

const renderEditModal = (habit) => {
    emit('edit', habit)
}
</script>

<template>
  <div id="habitCard" class="cardWrapper">
    <div class="rankColor" :class="rank + '-reward'"> 
      <PlusIcon class="plus" />
    </div>

    <div class="habitContent" :class="rank + '-opac'">
      <h4>{{ habit.title }}</h4>
      <p>#{{ habit.tag_name }}</p>
      <div class="habitCounters">
        <p>{{ habit.counter }}</p>
        <p>{{ habit.current_streak }}</p>
      </div>
    </div>

    <div class="editIconContainer" @click="renderEditModal(habit)">
      <EditIcon class="editIcon" />
    </div>
  </div>
</template>