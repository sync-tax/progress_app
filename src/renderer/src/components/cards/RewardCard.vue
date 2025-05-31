<script setup>
import EditIcon from '../../assets/edit.svg'

import { computed } from 'vue'

const props = defineProps({
    reward: {
        type: Object,
        required: true
    }
})

const rankHoverStyle = computed(() => {
    return props.reward.rank + '-opac'
})

const emit = defineEmits(['edit', 'update-and-delete'])

const renderEditModal = (reward) => {
    emit('edit', reward)
}

const updateBalanceAndDeleteReward = (reward) => {
    emit('update-and-delete', reward)
}

</script>

<template>
  <div class="rewardCard" :class="rankHoverStyle">
    <div class="rankColor" :class="props.reward.rank"> 
      <div class="costWrapper" @click="updateBalanceAndDeleteReward(reward)">
        <img src="../../assets/crystal.png" alt="crystal cost">
        <p>{{ reward.cost }}</p>
      </div>
    </div>

    <div class="rewardContent">
      <h4>{{ reward.title }}</h4>
    </div>

    <div class="editIconContainer" @click="renderEditModal(reward)">
      <EditIcon class="editIcon" />
    </div>
  </div>
</template>