<script setup>
import PlusIcon from '../assets/plus.svg'
import EditIcon from '../assets/edit.svg'
import RepeatIcon from '../assets/repeat.svg'

import ModuleTitle from '../components/ModuleTitle.vue'

import { useBalance } from '../composables/db_functions/useBalance'
import { useRewards } from '../composables/db_functions/useRewards'
import { useKeydowns } from '../composables/helpers/useKeydowns'
import { useToasts } from '../composables/ui/useToasts'
import { useInlineEditor } from '../composables/ui/useEdit'

//toRaw removes reactivity from an object -> required for ipc communication
import { onMounted, onUnmounted, toRaw } from 'vue'

const { fetchBalance, onBalanceUpdate } = useBalance()
const { getRewards, rewards, deleteReward, updateReward, addReward: addRewardLogic, unlockReward: unlockRewardLogic, onRewardsUpdate } = useRewards()
const { addToast } = useToasts()

let cleanupBalanceUpdate = null
let cleanupRewardsUpdate = null

onMounted(async () => {
  await getRewards();

  cleanupBalanceUpdate = onBalanceUpdate(() => {
    fetchBalance()
  })

  cleanupRewardsUpdate = onRewardsUpdate(() => {
    getRewards()
  })
});

onUnmounted(() => {
  //cleanup listeners
  if (cleanupBalanceUpdate) {
    cleanupBalanceUpdate();
  }
  if (cleanupRewardsUpdate) {
    cleanupRewardsUpdate();
  }
});

// USE EDITOR
const { 
  editingId, 
  editedItemData, 
  startEditing, 
  cancelEditing, 
  saveEditing, 
  deleteEditing 
} = useInlineEditor({
  updateFn: updateReward,
  deleteFn: deleteReward,
  fetchFn: getRewards,
  onSaveSuccess: () => {
    addToast({ message: 'Saved Reward.', type: 'success' });
  },
  onDeleteSuccess: () => {
    addToast({ message: 'Deleted Reward.', type: 'warning' });
  }
});

// KEYDOWN LOGIC
// TODO: Implement Buttons
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

// REWARD UNLOCK LOGIC
const unlockReward = async (reward) => {
  // no purchases while editing
  if (editingId.value) return

  try {
    const result = await unlockRewardLogic(reward);

    if (result.success) {
      addToast({ message: result.message, type: 'success' })
    } else {
      addToast({ message: result.message, type: 'error' })
    }
  } catch (error) {
    console.error('Error unlocking reward:', error)
    addToast({ message: 'An error occurred while trying to unlock the reward.', type: 'error' })
  }
};

const addReward = async () => {
  const result = await addRewardLogic();
  //check if all return values arrived
  if (result && result.success && result.newReward) {
    startEditing(toRaw(result.newReward));
    addToast({ message: result.message, type: 'info' }); 
  } else {
    addToast({ message: 'Failed to add reward.', type: 'error' });
  }
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
          <div class="rankColor" @click="!editingId ? unlockReward(toRaw(reward)) : null">
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
            <input class="titleInput" type="text" placeholder="Title" v-model="editedItemData.title">
            <input class="costInput" type="number" placeholder="Cost" v-model.number="editedItemData.cost">
          </div>
          <div class="repeatIconContainer" @click="editedItemData.repeatable = !editedItemData.repeatable">
            <RepeatIcon :class="editedItemData.repeatable ? 'repeatEnabled' : 'repeatDisabled'" />
          </div>
        </div>
      </template>
      <!-- Edit Template END -->
    </div>
    <!-- Reward Card END -->
    <div class="addRewardWrapper"
      @click="addReward()">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>