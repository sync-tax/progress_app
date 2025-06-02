<script setup>
import PlusIcon from '../assets/plus.svg'

import RewardCard from '../components/cards/RewardCard.vue'
import AddRewardModal from '../components/modals/AddRewardModal.vue'
import EditRewardModal from '../components/modals/EditRewardModal.vue'

import { useBalance } from '../composables/db_functions/useBalance'
import { useRewards } from '../composables/db_functions/useRewards'
import { useAddModalVisibility } from '../composables/modal_functions/useAddModalVisibility'
import { useEditModalVisibility } from '../composables/modal_functions/useEditModalVisibility'

import { onMounted } from 'vue'

const { fetchBalance, balance, removeBalance } = useBalance()
const { fetchRewards, rewards, deleteReward } = useRewards()
onMounted(async () => {
  fetchRewards()
  fetchBalance()
})

const { isVisible: addModalVisible, showModal: showAddModal, hideModal: hideAddModal } = useAddModalVisibility(fetchRewards)
const { isVisible: editModalVisible, showModal: showEditModal, hideModal: hideEditModal, editedData } = useEditModalVisibility(fetchRewards)

const updateBalanceAndDeleteReward = async (reward) => {
  await fetchBalance()
  if (reward.cost > balance.value) {
    console.error('Insufficient balance!')
    return
  }
  removeBalance(reward.cost)
  if (!reward.repeatable) {
    deleteReward(reward.id)
  }
  fetchRewards()
}

</script>

<template>
  <div class="moduleTitle">
    <h1>Rewards</h1>
  </div>


  <div id="rewardsWrapper" class="moduleWrapper">
    <RewardCard v-for="reward in rewards" :key="reward.id" :reward="reward" @edit="showEditModal(reward)" @update-and-delete="updateBalanceAndDeleteReward(reward)" />
    <div class="addRewardWrapper" @click="showAddModal()">
      <PlusIcon class="addIcon" />
    </div>
  </div>

  <AddRewardModal v-if="addModalVisible" @close="hideAddModal()" />
  <EditRewardModal v-if="editModalVisible && editedData" :data="editedData" @close="hideEditModal()" />
</template>