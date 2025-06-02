<script setup>
import { useTags } from '../../composables/db_functions/useTags'
import { useModalActions } from '../../composables/modal_functions/useModalActions'

const { tagData, addTag } = useTags()
const emit = defineEmits(['close'])

const save = async () => {
  //checks for empty input
  if (!tagData.value.title.trim()) return
  //calls addTag function with trimmed title
  addTag({ title: tagData.value.title.trim() })
  //emits close event
  emit('close')
}

const cancel = () => {
  emit('close')
}

// passes save and cancel functions to keydown events (ENTER and ESC)
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
      <!-- v-model="tagData.title" binds input value to tagData.title -->
      <input v-model="tagData.title" type="text" placeholder="Title..." spellcheck="false">
      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>
