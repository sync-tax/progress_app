<script setup>
// ========== IMPORTS ==========
// Vue
import { computed, ref } from 'vue';
// Icons
import RepeatIcon from '../assets/repeat.svg';
// Composables
import { useKeydowns } from '../composables/helpers/useKeydowns';


// ========== DATA ==========
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  itemType: {
    type: String,
    required: true,
    validator: (value) => ['rewards', 'tags', 'ideas', 'habits', 'habit_stacks'].includes(value)
  },
  allTags: {
    type: Array,
    default: () => []
  },
  allHabitStacks: {
    type: Array,
    default: () => []
  }
});

const confirmDelete = ref(false);

// ========== EMITS ========== 
const emit = defineEmits(['update:modelValue', 'save-edit', 'cancel-edit', 'delete-edit']);

// ========== COMPUTED ========== 
// Syncs v-model with props
const editableItem = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

// ========== FUNCTIONS ========== 
// Listens to keydowns
useKeydowns({
  onSave: () => emit('save-edit'),
  onCancel: () => emit('cancel-edit'),
  onDelete: () => confirmDelete.value === false ? confirmDelete.value = true : emit('delete-edit') //delete only on double Keydown -> 2x'DELETE'
});
</script>

<template>
  <div class="editWrapper">
    <h2 class="editTitle">Edit {{ itemType.charAt(0).toUpperCase() + itemType.slice(1) }}</h2>
    <!-- IDEA -->
    <template v-if="itemType === 'ideas'">
      <div class="inputWrapper">
        <label for="title">Title</label>
        <input type="text" placeholder="Add Idea Title" spellcheck="false" v-model="editableItem.title" />
      </div>
      <div class="inputWrapper">
        <label for="description">Description</label>
        <textarea placeholder="Description" spellcheck="false" v-model="editableItem.description"></textarea>
      </div>
    </template>

    <!-- HABIT STACK -->
    <template v-if="itemType === 'habit_stacks'">
      <div class="inputWrapper">
        <label for="stackTitle">Stack Title</label>
        <input type="text" placeholder="Stack Title" spellcheck="false" v-model="editableItem.title" />
      </div>
    </template>

    <!-- HABIT -->
    <template v-if="itemType === 'habits'">
      <div class="inputWrapper">
        <label for="habitTitle">Habit Title</label>
        <input type="text" placeholder="Habit Title" spellcheck="false" v-model="editableItem.title" />
      </div>
      <div class="inputWrapper">
        <label for="habitTag">Tag</label>
        <select v-model="editableItem.tag_name">
          <option disabled value="">Please select one</option>
          <option v-for="tag in allTags" :key="tag.id" :value="tag.title">
            #{{ tag.title }}
          </option>
        </select>
      </div>
      <div class="inputWrapper">
        <label for="habitStack">Stack</label>
        <select v-model="editableItem.stack_id">
          <option disabled value="">Please select one</option>
          <option v-for="stack in allHabitStacks" :key="stack.id" :value="stack.id">
            {{ stack.title }}
          </option>
        </select>
      </div>
    </template>

    <!-- TAG -->
    <template v-if="itemType === 'tags'">

      <div class="inputWrapper">
        <label for="title">Title</label>
        <input type="text" placeholder="Add Tag Title" spellcheck="false" v-model="editableItem.title" />
      </div>
    </template>

    <!-- REWARD -->
    <template v-if="itemType === 'rewards'">
      <div class="inputWrapper">
        <label for="title">Title</label>
        <input type="text" placeholder="Add Reward Title" spellcheck="false" v-model="editableItem.title" />
      </div>
      <div class="inputWrapper">
        <label for="cost">Cost</label>
        <input type="number" placeholder="10" spellcheck="false" v-model.number="editableItem.cost" />
      </div>
      <div class="inputWrapper">
        <div class="repeatIconContainer">
          <RepeatIcon id="repeatIcon" :class="editableItem.repeatable ? 'repeatEnabled' : 'repeatDisabled'"
            @click="editableItem.repeatable = !editableItem.repeatable" />
        </div>
      </div>
    </template>

    <button @click="emit('save-edit')" class="editButton saveButton">
      Save
    </button>
    <button @click="emit('cancel-edit')" class="editButton cancelButton">
      Cancel
    </button>
    <button v-if="confirmDelete == false" @click="confirmDelete = true" class="editButton deleteButton">
      Delete {{ itemType.charAt(0).toUpperCase() + itemType.slice(1) }}
    </button>
    <div v-else class="confirmationWrapper">
      <p>Are you sure you want to delete this {{ itemType.charAt(0).toUpperCase() + itemType.slice(1) }}?</p>
      <div class="confirmationButtons">
        <button @click="confirmDelete = false" class="deleteCancelButton">
          Cancel
        </button>
        <button @click="emit('delete-edit')" class="deleteDeleteButton">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
