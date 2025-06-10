<script setup>
// ========== IMPORTS ==========
// Icons
import PlusIcon from '../assets/plus.svg'

// Components
import ModuleTitle from '../components/ModuleTitle.vue'
import Card from '../components/Card.vue'
import EditItem from '../components/EditItem.vue'

// Composables
import { useHabits } from '../composables/db_functions/useHabits'
import { useHabitStacks } from '../composables/db_functions/useHabitStacks'
import { useTags } from '../composables/db_functions/useTags'
import { useToasts } from '../composables/ui/useToasts'
import { useEdit } from '../composables/ui/useEdit'
import { useUser } from '../composables/db_functions/useUser'

// Vue
import { onMounted, ref, toRaw } from 'vue'
// ========= DATA =========
const { addToast } = useToasts()
const { getTags: fetchTags, tags } = useTags()
const { 
  fetchHabits, 
  habits, 
  addHabit: addHabitLogic, 
  updateHabit, 
  deleteHabit, 
  toggleHabitCompletion, 
  runDailyStreakUpdate 
} = useHabits()
const { fetchHabitStacks, habitStacks, addHabitStack, updateHabitStack, deleteHabitStack } = useHabitStacks()
const { balance } = useUser()
// ========= LIFECYCLE =========
onMounted(async () => {
  await fetchHabits()
  await runDailyStreakUpdate()
  await fetchTags()
  await fetchHabitStacks()
})

// ========== EDITOR CONFIGS ========== 
// Habit Editor
const { 
  editingId: habitEditingId, 
  editedItemData: habitEditedItemData, 
  startEditing: habitStartEditing, 
  cancelEditing: habitCancelEditing, 
  saveEditing: habitSaveEditing, 
  deleteEditing: habitDeleteEditing 
} = useEdit({
  editFn: updateHabit,
  deleteFn: deleteHabit,
})

// Habit Stack Editor
const { 
  editingId: stackEditingId, 
  editedItemData: stackEditedItemData, 
  startEditing: stackStartEditing, 
  cancelEditing: stackCancelEditing, 
  saveEditing: stackSaveEditing, 
  deleteEditing: stackDeleteEditing 
} = useEdit({
  editFn: updateHabitStack,
  deleteFn: deleteHabitStack,
})

// ========= FUNCTIONS =========
const addHabit = async (stackId) => {
  try {
    const result = await addHabitLogic({stack_id: stackId}); // returns { success: boolean, message: string, newHabit: object }
    if (result.success) {
      // starts edit on new habit
      habitStartEditing(toRaw(result.addedHabit));
      addToast({ message: result.message, type: 'info' });
    } else {
      addToast({ message: 'Failed to add habit.', type: 'error' });
      console.error('Failed to add habit:', result.message)
    }
  } catch (error) {
    console.error('Error adding habit:', error)
    addToast({ message: 'An error occured...', type: 'error' })
  }
}
</script>

<template>
  <ModuleTitle title="Habits" />
  <!--TODO: Find a nice pos for this button-->  <!--<div class="addHabitStackWrapper"
    @click="addHabitStack({ title: 'New Habit Stack', position: habitStacks.length + 1 }); fetchHabitStacks();">
    <p>ADD STACK</p>
  </div>-->

  <div id="habitsWrapper" class="moduleWrapper">
    <div v-for="habitStack in habitStacks" :key="habitStack.id" class="habitStackCard">
      <div class="stackTitleWrapper">
        <template v-if="stackEditingId !== habitStack.id">
          <Card
          :itemData="habitStack" 
          :itemType="'stack'" 
          @start-edit="stackStartEditing(habitStack)"
        />
        </template>
        <template v-else>
          <EditItem 
          :itemType="'stack'" 
          v-model="stackEditedItemData" 
          @save="stackSaveEditing"
          @cancel="stackCancelEditing"
          @delete="stackDeleteEditing"
        />
        </template>
      </div>

      <div v-for="habit in habits.filter(habit => habit.stack_id === habitStack.id)" :key="habit.id" id="habitCard">
        <template v-if="habitEditingId !== habit.id">
          <Card
          :itemData="habit" 
          :itemType="'habit'" 
          @start-edit="habitStartEditing(habit)"
          @toggle-completion="toggleHabitCompletion(habit.id); addToast({ message: '+10 crystals.', type: 'crystals' })"
        />
        </template>
        <template v-else>
          <EditItem 
          :itemType="'habit'"
          :allTags="tags"
          :allHabitStacks="habitStacks" 
          v-model="habitEditedItemData" 
          @save="habitSaveEditing"
          @cancel="habitCancelEditing"
          @delete="habitDeleteEditing"
        />
        </template>
      </div>
      <div v-if="habitEditingId === null" class="addHabitWrapper"
        @click="addHabit(habitStack.id); fetchHabits();">
        <PlusIcon class="addIcon" />
      </div>
    </div>
  </div>
</template>