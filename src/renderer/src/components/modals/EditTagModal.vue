<script setup>
import DeleteIcon from '../../assets/delete.svg'
import { useModalActions } from '../../composables/modal_functions/useModalActions'
import { useTags } from '../../composables/db_functions/useTags'

const { tagData, updateTag, deleteTag } = useTags()

//grabs passed tag data
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

//sets tagData to passed tag data
//to prefill v-model with old tag title when opening
tagData.value.title = props.data.title

const emit = defineEmits(['close'])

const save = async () => {
  //checks for empty input
  if (!tagData.value?.title?.trim()) return
  
  updateTag({
    //spreads old tag data and only changes title
    ...props.data,
    title: tagData.value.title
  })
  
  emit('close')
}

const remove = async () => {
  if (!props.data?.id) return
  //calls deleteTag function with tag id
  deleteTag(props.data.id)
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
      />

      <div class="deleteIconContainer" @click="remove">
        <DeleteIcon class="deleteIcon" />
      </div>

      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>