<script setup>
import DeleteIcon from '../../assets/delete.svg'

import { ref, watch, onMounted } from 'vue'

onMounted( async () => {
    await console.log(window.api)
})

const props = defineProps({
  tag: Object
})

const label = ref('')

watch(
  () => props.tag,
  (tag) => {
    if (tag) {
      label.value = tag.label
    }
  },
  { immediate: true }
)

const emit = defineEmits(['close'])

const save = async () => {
  if (!props.tag) return
  await window.api.updateTag({ ...props.tag, label: label.value })
  emit('close')
}

const deleteTag = async () => {
  if (!props.tag) return
  await window.api.deleteTag(props.tag.id)
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
    <div class="editTagForm">
      <h4>Edit Tag</h4>
      <input v-model="label" type="text" placeholder="Label..." />
      <div class="deleteIconContainer" @click="deleteTag()">
        <DeleteIcon class="cancelIcon" />
      </div>
      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>