<script setup>
import EditIcon from '../../assets/edit.svg'

import { computed } from 'vue'

const props = defineProps({
    reward: {
        type: Object,
        required: true
    }
})

const rank = computed(() => {
    return props.reward.rank
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
  <div id="rewardCard" class="cardWrapper">
    <div class="rankColor" :class="rank + '-reward'" @click="updateBalanceAndDeleteReward(reward)"> 
      <div class="costWrapper">
        <img src="../../assets/crystal.png" alt="crystal cost">
        <p>{{ reward.cost }}</p>
      </div>
    </div>

    <div class="rewardContent" :class="rank + '-opac'">
      <h4>{{ reward.title }}</h4>
    </div>

    <div class="editIconContainer" @click="renderEditModal(reward)">
      <EditIcon class="editIcon" />
    </div>
  </div>
</template>