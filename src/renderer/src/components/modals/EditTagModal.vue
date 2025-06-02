<script setup>
import DeleteIcon from '../../assets/delete.svg'
import { watch } from 'vue'
import { useModalActions } from '../../composables/modal_functions/useModalActions'
import { useTags } from '../../composables/db_functions/useTags'

const { tagData, updateTag, deleteTag } = useTags()

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// Update local copy when prop changes
watch(
  () => props.data,
  (data) => {
    if (data) {
      tagData.value.title = data.title
    }
  },
  { immediate: true, deep: true }
)

const emit = defineEmits(['close'])

const save = async () => {
  if (!tagData.value?.title?.trim()) return
  
  await updateTag({
    ...props.data,
    title: tagData.value.title
  })
  
  emit('close')
}

const remove = async () => {
  if (!props.data) return
  await deleteTag(props.data.id)
  emit('close')
}

const cancel = () => {
  emit('close')
}

useModalActions({
    onSave: () => {
        save()
    },
    onCancel: () => {
        cancel()
    }
})
</script>

<template>
  <div class="modalWrapper">
    <div class="editModal">
      <h4>Edit Tag</h4>
      <input 
        v-model="tagData.title" 
        type="text" 
        placeholder="Title..." 
        spellcheck="false"
        @keydown.enter="save"
      />

      <div class="deleteIconContainer" @click="remove">
        <DeleteIcon class="deleteIcon" />
      </div>

      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>