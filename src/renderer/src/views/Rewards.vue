<script setup>
import PlusIcon from '../assets/plus.svg'
import EditIcon from '../assets/edit.svg'
import RepeatIcon from '../assets/repeat.svg'

import ModuleTitle from '../components/ModuleTitle.vue'

import { useBalance } from '../composables/db_functions/useBalance'
import { useRewards } from '../composables/db_functions/useRewards'
import { useKeydowns } from '../composables/helpers/useKeydowns'

import { onMounted, ref, toRaw } from 'vue'

const { fetchBalance, balance, removeBalance } = useBalance()
const { fetchRewards, rewards, deleteReward, updateReward, addReward } = useRewards()
onMounted(async () => {
  fetchRewards()
  fetchBalance()
})

//EDIT LOGIC
const editingId = ref(null)
const editedReward = ref({})

const startEditing = (reward) => {
  editingId.value = reward.id
  //spread operator is used to create a new object (clone)
  editedReward.value = { ...reward }
}

const cancelEditing = () => {
  //reset reactive references
  editingId.value = null
  editedReward.value = {}
}

const saveEditing = async () => {
  // just to make sure lol
  if (!editingId.value) return
  // toRaw() is a vue function that removes reactivity from an object
  // this is needed because updateReward() takes an object as a parameter -> doesn't work with reactive objects
  updateReward(toRaw(editedReward.value))
  fetchRewards()
  cancelEditing()
}

const deleteEditing = () => {
  // just to make sure lol
  if (!editingId.value) return
  deleteReward(editingId.value)
  fetchRewards()
  cancelEditing()
}

//Who needs Buttons in a MVP?
useKeydowns({
  onSave: () => {
    saveEditing()
  },
  onCancel: () => {
    cancelEditing()
  },
  onDelete: () => {
    deleteEditing()
  }
})

//REWARD UNLOCK LOGIC
const updateBalanceAndDeleteReward = async (reward) => {
  // fetchBalance() comes with an await already
  // still need to await -> Else it will result in balance getting negative
  await fetchBalance()
  if (editingId.value === true) return
  if (reward.cost > balance.value) {
    alert('Insufficient balance!')
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
  <ModuleTitle title="Rewards" />

  <div id="rewardsWrapper" class="moduleWrapper">
    <!-- Reward Card START -->
    <div id="rewardCard" v-for="reward in rewards" :key="reward.id">
      <!-- Normal Template START -->
      <template v-if="editingId !== reward.id">
        <div class="cardWrapper">
          <div class="rankColor" @click="!editingId ? updateBalanceAndDeleteReward(reward) : null">
            <div class="costWrapper">
              <img src="../assets/crystal.png" alt="crystal cost">
              <p>{{ reward.cost }}</p>
            </div>
          </div>
          <div class="rewardContent">
            <h4>{{ reward.title }}</h4>
          </div>
          <div class="editIconContainer" @click="startEditing(reward)">
            <EditIcon class="editIcon" />
          </div>
        </div>
      </template>
      <!-- Normal Template END -->

      <!-- Edit Template START -->
      <template v-else>
        <div class="rewardEditWrapper">
          <div>
            <input class="titleInput" type="text" v-model="editedReward.title">
            <input class="costInput" type="number" v-model.number="editedReward.cost">
          </div>
          <div class="repeatIconContainer" @click="editedReward.repeatable = !editedReward.repeatable">
            <RepeatIcon :class="editedReward.repeatable ? 'repeatEnabled' : 'repeatDisabled'" />
          </div>
        </div>
      </template>
      <!-- Edit Template END -->
    </div>
    <!-- Reward Card END -->
    <div class="addRewardWrapper"
      @click="addReward({ title: 'New Reward', cost: 0, repeatable: false }); fetchRewards();">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>