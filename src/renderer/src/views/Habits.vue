<script setup>
import PlusIcon from '../assets/plus.svg'

import HabitCard from '../components/cards/HabitCard.vue'
import AddHabitModal from '../components/modals/AddHabitModal.vue'
import EditHabitModal from '../components/modals/EditHabitModal.vue'

import { useHabits } from '../composables/db_functions/useHabits'
import { useAddModalVisibility } from '../composables/modal_functions/useAddModalVisibility'
import { useEditModalVisibility } from '../composables/modal_functions/useEditModalVisibility'

import { onMounted } from 'vue'


const { fetchHabits, habits } = useHabits()
onMounted(async () => {
  fetchHabits()
})

const { isVisible: addModalVisible, showModal: showAddModal, hideModal: hideAddModal } = useAddModalVisibility(fetchHabits)
const { isVisible: editModalVisible, showModal: showEditModal, hideModal: hideEditModal, editedData } = useEditModalVisibility(fetchHabits)
</script>

<template>
  <div class="moduleTitle">
    <h1>Habits</h1>
  </div>


  <div id="habitsWrapper" class="moduleWrapper">
    <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" @edit="showEditModal(habit)" />
    <div class="addHabitWrapper" @click="showAddModal()">
      <PlusIcon class="addIcon" />
    </div>
  </div>
  <AddHabitModal v-if="addModalVisible" @close="hideAddModal()" />
  <EditHabitModal v-if="editModalVisible && editedData" :data="editedData" @close="hideEditModal()" />
</template>