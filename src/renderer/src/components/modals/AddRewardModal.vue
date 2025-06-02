<script setup>
import { useRewards } from '../../composables/db_functions/useRewards'
import { useModalActions } from '../../composables/modal_functions/useModalActions'

const { rewardData, addReward } = useRewards()
const emit = defineEmits(['close'])

const save = async () => {
    if (!rewardData.value.title.trim()) return
    await addReward({ 
        title: rewardData.value.title.trim(), 
        rank: rewardData.value.rank, 
        cost: rewardData.value.cost,
        repeatable: rewardData.value.repeatable })
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
            <h4>Add Reward</h4>
            <input v-model="rewardData.title" type="text" placeholder="Title..." spellcheck="false">

            <input 
          v-model="rewardData.cost" 
          type="number" 
          :placeholder="`Cost...`"
        />
        <select v-model="rewardData.rank">
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>

        <input 
          v-model="rewardData.repeatable"
          type="checkbox" 
        />

            <span>ESC = Cancel | ENTER = Save</span>
        </div>
    </div>
</template>
