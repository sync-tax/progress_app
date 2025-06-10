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
    validator: (value) => ['reward', 'tag', 'idea', 'habit', 'stack'].includes(value)
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

const addedItem = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

// ========== EMITS ========== 
const emit = defineEmits(['save-add', 'cancel-add']);

// ========== FUNCTIONS ========== 
// Listens to keydowns
useKeydowns({
  onSave: () => emit('save-add'),
  onCancel: () => emit('cancel-add')
});
</script>

<template>
  <div class="addWrapper">
    <h2 class="addTitle">Add {{ itemType.charAt(0).toUpperCase() + itemType.slice(1) }}</h2>

    <!-- REWARD -->
    <template v-if="itemType === 'reward'">
      <div class="inputWrapper">
        <label for="title">Title</label>
        <input type="text" placeholder="Add Reward Title" spellcheck="false" v-model="addedItem.title" />
      </div>
      <div class="inputWrapper">
        <label for="cost">Cost</label>
        <input type="number" placeholder="10" spellcheck="false" v-model.number="addedItem.cost" />
      </div>
      <div class="inputWrapper">
        <div class="repeatIconContainer">
          <RepeatIcon id="repeatIcon" :class="addedItem.repeatable ? 'repeatEnabled' : 'repeatDisabled'"
            @click="addedItem.repeatable = !addedItem.repeatable" />
        </div>
      </div>
    </template>

    <button @click="emit('save-add')" class="editButton saveButton">
      Save
    </button>
    <button @click="emit('cancel-add')" class="editButton cancelButton">
      Cancel
    </button>
  </div>
</template>
