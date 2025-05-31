<script setup>
import PlusIcon from '../assets/plus.svg'

import RewardCard from '../components/cards/RewardCard.vue'
import AddModal from '../components/modals/AddModal.vue'
import EditModal from '../components/modals/EditModal.vue'

import { ref, onMounted } from 'vue'

const rewards = ref([])
const fetchRewards = async () => {
  rewards.value = await window.api.getRewards()
}

const balance = ref(0)
const fetchBalance = async () => {
  balance.value = await window.api.getBalance()
}

onMounted(async () => {
  fetchRewards()
  fetchBalance()
})

const addFormIsVisible = ref(false)

const renderAddForm = () => {
  addFormIsVisible.value = true
}

const closeAddForm = () => {
  addFormIsVisible.value = false
  fetchRewards()
}

const editFormIsVisible = ref(false)
const editingReward = ref(null)
const renderEditModal = (reward) => {
  editingReward.value = reward
  editFormIsVisible.value = true
}

const closeEditModal = () => {
  editFormIsVisible.value = false
  fetchRewards()
}

const updateBalanceAndDeleteReward = async (reward) => {
  await fetchBalance()
  if (reward.cost > balance.value) {
    console.log('Insufficient balance!')
    return
  }

  window.api.removeBalance(reward.cost)
  if (!reward.repeatable) {
    window.api.deleteReward(reward.id)
  }
  fetchRewards()
}

</script>

<template>
  <div class="moduleTitle">
    <h1>Rewards</h1>
  </div>


  <div class="rewardsWrapper">
    <RewardCard v-for="reward in rewards" :key="reward.id" :reward="reward" @edit="renderEditModal(reward)" @update-and-delete="updateBalanceAndDeleteReward(reward)" />
    <div class="addRewardWrapper" @click="renderAddForm()">
      <PlusIcon class="addIcon" />
    </div>
  </div>

  <AddModal v-if="addFormIsVisible" type="reward" @close="closeAddForm()" />
  <EditModal v-if="editFormIsVisible && editingReward" type="reward" :data="editingReward" @close="closeEditModal()" />
</template>