<script setup>
import PlusIcon from '../assets/plus.svg'
import EditIcon from '../assets/edit.svg'

import ModuleTitle from '../components/ModuleTitle.vue'

import { useKeydowns } from '../composables/helpers/useKeydowns'
import { useHabits } from '../composables/db_functions/useHabits'
import { useHabitStacks } from '../composables/db_functions/useHabitStacks'
import { useTags } from '../composables/db_functions/useTags'

import { onMounted, ref, toRaw } from 'vue'

const { fetchTags, tags } = useTags()
const { fetchHabits, habits, addHabit, updateHabit, deleteHabit } = useHabits()
const { fetchHabitStacks, habitStacks, addHabitStack, updateHabitStack, deleteHabitStack } = useHabitStacks()
onMounted(async () => {
  fetchHabits()
  fetchTags()
  fetchHabitStacks()
})

//EDIT LOGIC
const editingId = ref(null)
const editingType = ref(null) // 'habit' or 'stack'
const editedData = ref({})

const startEditing = (item, type) => {
  fetchTags()
  editingId.value = item.id
  editingType.value = type
  //spread operator is used to create a new object (clone)
  editedData.value = { ...item }
}

const cancelEditing = () => {
  //reset reactive references
  editingId.value = null
  editingType.value = null
  editedData.value = {}
}

const saveEditing = async () => {
  if (!editingId.value || !editingType.value) return

  if (editingType.value === 'habit') {
    updateHabit(toRaw(editedData.value))
    fetchHabits()
  } else if (editingType.value === 'stack') {
    updateHabitStack(toRaw(editedData.value))
    fetchHabitStacks()
  }
  cancelEditing()
}

const deleteEditing = () => {
  if (!editingId.value || !editingType.value) return

  if (editingType.value === 'habit') {
    deleteHabit(editingId.value)
    fetchHabits()
  } else if (editingType.value === 'stack') {
    const isStackPopulated = habits.value.some(h => h.stack_id === editingId.value)
    if (isStackPopulated) {
      alert('Cannot delete stack: It has habits assigned to it. Please move or delete the habits first.')
      return // prevent deletion if stack contains habits
    }
    deleteHabitStack(editingId.value)
    fetchHabitStacks()
  }
  cancelEditing()
}

//Who needs Buttons in a MVP?
useKeydowns({
  onSave: () => {
    saveEditing()
  },
  onCancel: () => {
    cancelEditing()
  },
  onDelete: () => {
    deleteEditing()
  }
})

//RANK LOGIC
const getRank = (habit) => {
  if (habit.best_streak * habit.counter >= 2000) return 'legendary'
  else if (habit.best_streak * habit.counter >= 1000) return 'epic'
  else if (habit.best_streak * habit.counter >= 500) return 'rare'
  else if (habit.best_streak * habit.counter >= 100) return 'uncommon'
  else return 'common'
}

// --- Checkbox Logic for Habit Completion ---
const getStartOfDay = (dateInput) => {
  if (!dateInput && dateInput !== 0) return null; // Handle null, undefined. Allow 0 for epoch.
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null; // Handle invalid date strings
  date.setHours(0, 0, 0, 0);
  return date;
};

const isSameDateAsToday = (dateValue) => {
  if (!dateValue) return false;
  const dateToCompare = getStartOfDay(dateValue);
  if (!dateToCompare) return false;
  const today = getStartOfDay(new Date());
  return dateToCompare.getTime() === today.getTime();
};

const toggleHabitCompletion = async (habit) => {
  const todayStart = getStartOfDay(new Date());
  // Create a mutable copy for modification and update
  // toRaw() is essential here before spreading, if habit is a reactive proxy
  const habitDataToUpdate = { ...toRaw(habit) }; 

  if (isSameDateAsToday(habitDataToUpdate.last_time_completed)) {
    // Currently checked (completed today), so we are unchecking
    habitDataToUpdate.counter = Math.max(0, habitDataToUpdate.counter - 1);
    habitDataToUpdate.current_streak = Math.max(0, habitDataToUpdate.current_streak - 1);
    // No need to change best_streak when unchecking
    // Set last_time_completed to yesterday to make it not today
    const yesterday = getStartOfDay(new Date(todayStart.getTime() - 24 * 60 * 60 * 1000));
    habitDataToUpdate.last_time_completed = yesterday;
  } else {
    // Currently unchecked (or completed on a previous day), so we are checking for today
    habitDataToUpdate.counter++;
    
    const yesterdayStart = getStartOfDay(new Date(todayStart.getTime() - 24 * 60 * 60 * 1000));
    const lastCompletedDayStart = getStartOfDay(habitDataToUpdate.last_time_completed);

    if (lastCompletedDayStart && lastCompletedDayStart.getTime() === yesterdayStart.getTime()) {
      // Completed yesterday, so continue streak
      habitDataToUpdate.current_streak++;
    } else {
      // Not completed yesterday (or first time), so reset streak to 1
      habitDataToUpdate.current_streak = 1;
    }

    // Update best_streak if current_streak is greater
    if (habitDataToUpdate.current_streak > habitDataToUpdate.best_streak) {
      habitDataToUpdate.best_streak = habitDataToUpdate.current_streak;
    }

    habitDataToUpdate.last_time_completed = todayStart;
  }

  await updateHabit(habitDataToUpdate); // updateHabit expects a raw object or handles reactivity
  fetchHabits(); // Refresh local data
};
</script>

<template>
  <ModuleTitle title="Habits" />
  <!--Dont like the look, will implement a better one later-->
  <!--<div class="addHabitStackWrapper"
    @click="addHabitStack({ title: 'New Habit Stack', position: habitStacks.length + 1 }); fetchHabitStacks();">
    <p>ADD STACK</p>
  </div>-->

  <div id="habitsWrapper" class="moduleWrapper">
    <!-- Habit Card START -->
    <div v-for="habitStack in habitStacks" :key="habitStack.id" class="habitStackCard">
      <div class="stackTitleWrapper">
        <template v-if="editingId === habitStack.id && editingType === 'stack'">
          <input class="titleInput" v-model="editedData.title" @keyup.enter="saveEditing" @keyup.esc="cancelEditing">
        </template>
        <template v-else>
          <h2>{{ habitStack.title }}</h2>
        </template>
        <EditIcon class="editStackIcon" @click="startEditing(habitStack, 'stack')" />
      </div>

      <div v-for="habit in habits.filter(habit => habit.stack_id === habitStack.id)" :key="habit.id" id="habitCard">
        <!-- Normal Template START -->
        <template v-if="!(editingId === habit.id && editingType === 'habit')">
          <div class="cardWrapper">
            <div class="rankGems">
              <img v-if="getRank(habit) == 'legendary'" src="../assets/LEGENDARY_MARK.png" alt="tagIcon"
                class="rankMark" :class="getRank(habit) + '-glow'">
              <img v-if="getRank(habit) == 'epic'" src="../assets/EPIC_MARK.png" alt="tagIcon" class="rankMark"
                :class="getRank(habit) + '-glow'">
              <img v-if="getRank(habit) == 'rare'" src="../assets/RARE_MARK.png" alt="tagIcon" class="rankMark"
                :class="getRank(habit) + '-glow'">
              <img v-if="getRank(habit) == 'uncommon'" src="../assets/UNCOMMON_MARK.png" alt="tagIcon" class="rankMark"
                :class="getRank(habit) + '-glow'">
              <img v-if="getRank(habit) == 'common'" src="../assets/COMMON_MARK.png" alt="tagIcon" class="rankMark"
                :class="getRank(habit) + '-glow'">
            </div>
            <div class="habitContent">
              <div class="habitWrapper">

                <div class="labelDoneContainer">
                  <input type="checkbox"
                         :checked="isSameDateAsToday(habit.last_time_completed)"
                         @change="toggleHabitCompletion(habit)">
                  <h4 class="habitLabel">
                    {{ habit.title }}
                  </h4>
                </div>
                <p class="habitTag">
                  #{{ habit.tag_name }}
                </p>
              </div>
              <p class="habitStreak">
                Streak: {{ habit.current_streak }}
              </p>
            </div>
            <div class="editIconContainer" @click="startEditing(habit, 'habit')">
              <EditIcon class="editIcon" />
            </div>
          </div>
        </template>
        <!-- Normal Template END -->
        <!-- Edit Template START -->
        <template v-else>
          <div class="habitEditWrapper">
            <input class="titleInput" type="text" v-model="editedData.title">
            <select v-model="editedData.tag_name" @click="fetchTags()">
              <option v-for="tag in tags" :key="tag.id" :value="tag.title">
                #{{ tag.title }}
              </option>
            </select>
            <select v-model="editedData.stack_id" @click="fetchHabitStacks()">
              <option v-for="stack in habitStacks" :key="stack.id" :value="stack.id">
                {{ stack.title }}
              </option>
            </select>
          </div>
        </template>
        <!-- Edit Template END -->
      </div>
      <!-- Habit Card END -->
      <div v-if="editingId === null" class="addHabitWrapper"
        @click="addHabit({ title: 'New Habit', level: 1, counter: 0, current_streak: 0, stack_id: habitStack.id, tag_name: 'Other' }); fetchHabits();">
        <PlusIcon class="addIcon" />
      </div>
    </div>
  </div>
</template>