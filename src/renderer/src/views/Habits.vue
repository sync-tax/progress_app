<script setup>
import PlusIcon from '../assets/plus.svg'

import ModuleTitle from '../components/ModuleTitle.vue'
import HabitCard from '../components/cards/HabitCard.vue'

import { useHabits } from '../composables/db_functions/useHabits'

import { onMounted } from 'vue'


const { fetchHabits, habits } = useHabits()
onMounted(async () => {
  fetchHabits()
})
</script>

<template>
  <ModuleTitle title="Habits" />

  <div id="habitsWrapper" class="moduleWrapper">
    <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" @edit="showEditModal(habit)" />
    <div class="addHabitWrapper" @click="showAddModal()">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>