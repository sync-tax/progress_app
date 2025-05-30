<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const formData = ref({
  title: '',
  description: '',
  rank: 'common'
})

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['idea', 'tag'].includes(value)
  }
})

const emit = defineEmits(['close'])

const save = async () => {
  if (props.type === 'tag') {
    await window.api.addTag({ title: formData.value.title })
  } else if (props.type === 'idea') {
    await window.api.addIdea({ title: formData.value.title, description: formData.value.description, rank: formData.value.rank })
  }
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

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div class="modalWrapper">
    <div class="addModal">
      <h4>Add {{ props.type.charAt(0).toUpperCase() + props.type.slice(1) }}</h4>
      
      <input 
        v-model="formData.title" 
        type="text" 
        :placeholder="`Title...`" 
      />
      
      <template v-if="type === 'idea'">
        <textarea 
          v-model="formData.description" 
          placeholder="Description..." 
          rows="3"
          maxlength="90"
        ></textarea>
        <select v-model="formData.rank">
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
      </template>
      
      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>
