<script setup>
import DeleteIcon from '../../assets/delete.svg'
import { watch } from 'vue'
import { useModalActions } from '../../composables/modal_functions/useModalActions'
import { useRewards } from '../../composables/db_functions/useRewards'

const { rewardData, updateReward, deleteReward } = useRewards()

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
      rewardData.value.title = data.title
      rewardData.value.cost = data.cost
      rewardData.value.rank = data.rank
      rewardData.value.repeatable = data.repeatable
    }
  },
  { immediate: true, deep: true }
)

const emit = defineEmits(['close'])

const save = async () => {
  if (!rewardData.value?.title?.trim()) return

  await updateReward({
    ...props.data,
    title: rewardData.value.title,
    cost: rewardData.value.cost,
    rank: rewardData.value.rank,
    repeatable: rewardData.value.repeatable
  })

  emit('close')
}

const remove = async () => {
  if (!props.data) return
  await deleteReward(props.data.id)
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
      <h4>Edit Reward</h4>
      <input v-model="rewardData.title" type="text" placeholder="Title..." spellcheck="false" @keydown.enter="save" />
      <input v-model="rewardData.cost" type="number" :placeholder="`Cost...`" />
      <select v-model="rewardData.rank">
        <option value="common">Common</option>
        <option value="uncommon">Uncommon</option>
        <option value="rare">Rare</option>
        <option value="epic">Epic</option>
        <option value="legendary">Legendary</option>
      </select>

      <input v-model="rewardData.repeatable" type="checkbox" />


      <div class="deleteIconContainer" @click="remove">
        <DeleteIcon class="deleteIcon" />
      </div>

      <span>ESC = Cancel | ENTER = Save</span>
    </div>
  </div>
</template>