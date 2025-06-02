<script setup>
import { useTags } from '../../composables/db_functions/useTags'
import { useModalActions } from '../../composables/modal_functions/useModalActions'

const { tagData, addTag } = useTags()
const emit = defineEmits(['close'])

const save = async () => {
  if (!tagData.value.title.trim()) return
  await addTag({ title: tagData.value.title.trim() })
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
    <div class="addModal">
      <h4>Add Tag</h4>
      <input v-model="tagData.title" type="text" placeholder="Title..." spellcheck="false">
      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>
