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
  rank: 'common',
  cost: 0
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
      if (props.type === 'reward') {
        formData.value.cost = data.cost
        formData.value.rank = data.rank
        formData.value.repeatable = data.repeatable
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
  } else if (props.type === 'reward') {
    await window.api.updateReward({
      ...props.data,
      title: formData.value.title,
      cost: formData.value.cost,
      rank: formData.value.rank,
      repeatable: formData.value.repeatable
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
  } else if (props.type === 'reward') {
    await window.api.deleteReward(props.data.id)
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
          spellcheck="false"
        ></textarea>
        <select v-model="formData.rank">
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
      </template>
      
      <template v-if="type === 'reward'">
        <input 
          v-model="formData.cost" 
          type="number" 
          :placeholder="`Cost...`" 
        />
        <select v-model="formData.rank">
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>

        <input 
          v-model="formData.repeatable"
          type="checkbox" 
        />
      </template>
      
      <div class="deleteIconContainer" @click="deleteItem">
        <DeleteIcon class="deleteIcon" />
      </div>
      
      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>