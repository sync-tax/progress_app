<script setup>
import DeleteIcon from '../../assets/delete.svg'
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['tag', 'idea'].includes(value)
  },
  data: Object
})

const formData = ref({
  title: '',
  description: '',
  rank: 'common'
})

watch(
  () => props.data,
  (data) => {
    if (data) {
      formData.value.title = data.title
      if (props.type === 'idea') {
        formData.value.description = data.description
        formData.value.rank = data.rank
      }
    }
  },
  { immediate: true }
)

const emit = defineEmits(['close'])

const save = async () => {
  if (!props.data) return
  
  if (props.type === 'tag') {
    await window.api.updateTag({
      ...props.data,
      title: formData.value.title
    })
  } else if (props.type === 'idea') {
    await window.api.updateIdea({
      ...props.data,
      title: formData.value.title,
      description: formData.value.description,
      rank: formData.value.rank
    })
  }
  
  emit('close')
}

const deleteItem = async () => {
  if (!props.data) return
  
  if (props.type === 'tag') {
    await window.api.deleteTag(props.data.id)
  } else if (props.type === 'idea') {
    await window.api.deleteIdea(props.data.id)
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
    <div class="editModal">
      <h4>Edit {{ type.charAt(0).toUpperCase() + type.slice(1) }}</h4>
      
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
      
      <div class="deleteIconContainer" @click="deleteItem">
        <DeleteIcon class="deleteIcon" />
      </div>
      
      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>