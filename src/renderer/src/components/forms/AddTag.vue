<script setup>
import { ref } from 'vue'

const label = ref('')

const emit = defineEmits(['close'])

const save = async () => {
  await window.api.addTag({ label: label.value })
  emit('close')
}

const cancel = () => {
  emit('close') 
}

const onKeyDown = (event) => {
  if (event.key === 'Enter') {
    save()
  } else if (event.key === 'Escape') {
    cancel()
  }
}
</script>

<template>
  <div class="formWrapper" @keydown="onKeyDown">
    <div class="addTagForm">
      <h4>Add Tag</h4>
      <input v-model="label" type="text" placeholder="Label..." />
      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>