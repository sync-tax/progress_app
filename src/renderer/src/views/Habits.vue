<script setup>
// ========== IMPORTS ==========
// Icons
import PlusIcon from '../assets/plus.svg'

// Components
import ModuleTitle from '../components/ModuleTitle.vue'
import Card from '../components/Card.vue'
import EditItem from '../components/EditItem.vue'
import AddItem from '../components/AddItem.vue'

// Composables
import { useUniversals } from '../composables/db_functions/useUniversals'
import { useHabits } from '../composables/db_functions/useHabits'
import { useHabitStacks } from '../composables/db_functions/useHabitStacks'
import { useEdit } from '../composables/ui/useEdit'
import { useAdd } from '../composables/ui/useAdd'
import { useSort } from '../composables/ui/useSort'

// Vue
import { onMounted, onUnmounted, ref, toRaw } from 'vue'
// ========= DATA =========
const {
  addHabit,
  editHabit,
  onHabitsUpdate,
  toggleHabitCompletion,
  updateAllStreaks
} = useHabits()
const { addHabitStack, editHabitStack, onHabitStacksUpdate } = useHabitStacks()
const { getItems, deleteItem, moveItem } = useUniversals()
const { sortByPosition } = useSort()

let cleanupHabitUpdate = null
let cleanupHabitStackUpdate = null


const habits = ref([])
const tags = ref([])
const habit_stacks = ref([])
// ========= LIFECYCLE =========
onMounted(async () => {
  habits.value = sortByPosition(await getItems('habits'))
  tags.value = sortByPosition(await getItems('tags'))
  habit_stacks.value = sortByPosition(await getItems('habit_stacks'))

  await updateAllStreaks()

  cleanupHabitUpdate = onHabitsUpdate(async () => {
    habits.value = sortByPosition(await getItems('habits'))
  })

  cleanupHabitStackUpdate = onHabitStacksUpdate(async () => {
    habit_stacks.value = sortByPosition(await getItems('habit_stacks'))
  })
})

onUnmounted(async () => {
  if (cleanupHabitUpdate) {
    await cleanupHabitUpdate()
  }

  if (cleanupHabitStackUpdate) {
    await cleanupHabitStackUpdate()
  }
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
  editFn: editHabit,
  deleteFn: deleteItem,
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
  editFn: editHabitStack,
  deleteFn: deleteItem,
})

// ========= ADDER CONFIGS ========== 
// Habit Adder
const {
  isAdding: habitIsAdding,
  addedItemData: habitAddedItemData,
  activeListId: habitActiveListId,
  startAdding: habitStartAdding,
  cancelAdding: habitCancelAdding,
  saveAdding: habitSaveAdding
} = useAdd({
  addFn: addHabit,
  itemType: 'habits',
})

// TODO: Add Habit Stack Adder
const {
  isAdding: habitStackIsAdding,
  addedItemData: habitStackAddedItemData,
  startAdding: habitStackStartAdding,
  cancelAdding: habitStackCancelAdding,
  saveAdding: habitStackSaveAdding
} = useAdd({
  addFn: addHabitStack,
  itemType: 'habit_stacks'
})
</script>

<template>
  <ModuleTitle title="Habits" />

  <div id="habitsWrapper" class="moduleWrapper">
    <div v-for="habit_stack in habit_stacks" :key="habit_stack.id" class="habitStackCard">
      <div class="stackTitleWrapper">
        <template v-if="stackEditingId !== habit_stack.id">
          <Card :itemData="habit_stack" :itemType="'habit_stacks'"
            @start-edit="stackStartEditing(habit_stack, 'habit_stacks')"
            @move-item="moveItem(habit_stack, 'habit_stacks', $event)" />
        </template>

        <template v-else>
          <EditItem :itemType="'stacks'" v-model="stackEditedItemData" @save-edit="stackSaveEditing"
            @cancel-edit="stackCancelEditing" @delete-edit="stackDeleteEditing" />
        </template>
      </div>


      <div v-for="habit in habits.filter(habit => habit.stack_id === habit_stack.id)" :key="habit.id" id="habitCard">
        <template v-if="habitEditingId !== habit.id">
          <Card :itemData="habit" :itemType="'habits'" @start-edit="habitStartEditing(habit, 'habits')"
            @toggle-completion="toggleHabitCompletion(habit);" @move-item="moveItem(habit, 'habits', $event)" />
        </template>
        <template v-else>
          <EditItem :itemType="'habits'" :allTags="tags" :allHabitStacks="habit_stacks" v-model="habitEditedItemData"
            @save-edit="habitSaveEditing" @cancel-edit="habitCancelEditing" @delete-edit="habitDeleteEditing" />
        </template>
      </div>

      <!--Show AddIcon -->
      <template v-if="!habitIsAdding">
        <div class="addHabitWrapper" @click="habitStartAdding(habit_stack.id)">
          <PlusIcon class="addIcon" />
        </div>
      </template>
      <!--Show AddItem if adding button is clicked-->
      <template v-else-if="habitIsAdding && habit_stack.id == habitActiveListId">
        <AddItem :stackId="habit_stack.id" :itemType="'habits'" :allTags="tags" :allHabitStacks="habit_stacks"
          v-model="habitAddedItemData" @save-add="habitSaveAdding()" @cancel-add="habitCancelAdding()" />
      </template>
    </div>
    <template v-if="!habitStackIsAdding">
      <div class="addHabitStackWrapper" @click="habitStackStartAdding()">
        <PlusIcon class="addIcon" />
      </div>
    </template>
    <template v-else-if="habitStackIsAdding">
      <AddItem :itemType="'stacks'" v-model="habitStackAddedItemData" @save-add="habitStackSaveAdding()" @cancel-add="habitStackCancelAdding()" />
    </template>
  </div>
</template>