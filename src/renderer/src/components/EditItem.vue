<script setup>
// ========== IMPORTS ==========
// Vue
import { computed, ref } from 'vue';
// Icons
import SaveIcon from '../assets/save.svg';
import CancelIcon from '../assets/cancel.svg';
import DeleteIcon from '../assets/delete.svg';  
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
    validator: (value) => ['reward', 'tag', 'idea', 'habit'].includes(value)
  }
});

const confirmDelete = ref(false);

// ========== EMITS ========== 
const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'delete']);

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
  onSave: () => emit('save'),
  onCancel: () => emit('cancel'),
  onDelete: () => confirmDelete.value = true
});
</script>

<template>
  <div class="editWrapper">
    <h2>Edit {{ itemType.charAt(0).toUpperCase() + itemType.slice(1) }}</h2>
    <!-- IDEA -->
    <template v-if="itemType === 'idea'">
      <div class="inputWrapper">
        <label for="title">Title</label>
        <input type="text" placeholder="Add Idea Title" v-model="editableItem.title" />
      </div>
      <div class="inputWrapper">
        <label for="description">Description</label>
        <textarea spellcheck="false" placeholder="Description" v-model="editableItem.description"></textarea>
      </div>
    </template>
    <!-- TAG -->
    <template v-if="itemType === 'tag'">
      
      <div class="inputWrapper">
        <label for="title">Title</label>
        <input type="text" placeholder="Add Tag Title" v-model="editableItem.title" />
      </div>
    </template>

    <!-- REWARD -->
    <template v-if="itemType === 'reward'">
      <div class="inputWrapper">
        <label for="title">Title</label>
        <input type="text" placeholder="Add Reward Title" v-model="editableItem.title" />
      </div>
      <div class="inputWrapper">
        <label for="cost">Cost</label>
        <input type="number" placeholder="10" v-model.number="editableItem.cost" />
      </div>
      <div class="inputWrapper">
        <div class="repeatIconContainer">
          <RepeatIcon id="repeatIcon" :class="editableItem.repeatable ? 'repeatEnabled' : 'repeatDisabled'"
            @click="editableItem.repeatable = !editableItem.repeatable" />
        </div>
      </div>
    </template>

    <button @click="emit('save')" class="editButton saveButton">
      Save
    </button>
    <button @click="emit('cancel')" class="editButton cancelButton">
      Cancel
    </button>
    <button v-if="confirmDelete==false" @click="confirmDelete = true" class="editButton deleteButton">
      Delete {{itemType.charAt(0).toUpperCase() + itemType.slice(1)}}
    </button>
    <div v-else class="confirmationWrapper">
      <p>Are you sure you want to delete this {{itemType.charAt(0).toUpperCase() + itemType.slice(1)}}?</p>
      <div class="confirmationButtons">
        <button @click="confirmDelete = false" class="deleteCancelButton">
          Cancel
        </button>
        <button @click="emit('delete')" class="deleteDeleteButton">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
