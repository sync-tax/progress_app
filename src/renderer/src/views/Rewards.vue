<script setup>
 // ========== IMPORTS ==========
 // Icons
import PlusIcon from '../assets/plus.svg'
// Components
import ModuleTitle from '../components/ModuleTitle.vue'
import Card from '../components/Card.vue'
import EditItem from '../components/EditItem.vue'
// Composables
import { useBalance } from '../composables/db_functions/useBalance'
import { useRewards } from '../composables/db_functions/useRewards'
import { useToasts } from '../composables/ui/useToasts'
import { useInlineEditor } from '../composables/ui/useEdit'
// Vue
import { onMounted, onUnmounted, toRaw } from 'vue'

// ========== DATA ==========
const { fetchBalance, onBalanceUpdate } = useBalance()
const { getRewards, rewards, deleteReward, updateReward, addReward: addRewardLogic, unlockReward: unlockRewardLogic, onRewardsUpdate } = useRewards()
const { addToast } = useToasts()

let cleanupBalanceUpdate = null
let cleanupRewardsUpdate = null

// ========== LIFECYCLE ==========
onMounted(async () => {
  // fetch data
  await getRewards();
  // set listeners
  cleanupBalanceUpdate = onBalanceUpdate(() => {
    fetchBalance()
  })
  cleanupRewardsUpdate = onRewardsUpdate(() => {
    getRewards()
  })
});

onUnmounted(() => {
  // cleanup listeners
  if (cleanupBalanceUpdate) {
    cleanupBalanceUpdate();
  }
  if (cleanupRewardsUpdate) {
    cleanupRewardsUpdate();
  }
});

// ========== EDITOR CONFIGS ==========
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

// ========== CUSTOM FUNCTIONS ==========
const unlockReward = async (reward) => {
  // avoid unlocking while editing
  if (editingId.value) return

  try {
    const result = await unlockRewardLogic(reward); // returns { success: boolean, message: string, rewardCost: number }
    if (result.success) {
      addToast({message: '-' + result.rewardCost + ' Crystals', type: 'crystals'})
      addToast({ message: result.message, type: 'success' })
    } else {
      addToast({ message: result.message, type: 'error' })
    }
  } catch (error) {
    console.error('Error unlocking reward:', error)
    addToast({ message: 'An error occured...', type: 'error' })
  }
};

const addReward = async () => {
  try {
    const result = await addRewardLogic(); // returns { success: boolean, message: string, newReward: object }
    if (result.success) {
      // starts edit on new reward
      startEditing(toRaw(result.newReward));
      addToast({ message: result.message, type: 'info' });
    } else {
      addToast({ message: 'Failed to add reward.', type: 'error' });
    }
  } catch (error) {
    console.error('Error adding reward:', error)
    addToast({ message: 'An error occured...', type: 'error' })
  }
}

</script>

<template>
  <ModuleTitle title="Rewards" />

  <div id="rewardsWrapper" class="moduleWrapper">
    <div v-for="reward in rewards" :key="reward.id" class="rewardItemContainer">
      <!-- Render Card if not editing a specific reward -->
      <template v-if="editingId !== reward.id">
        <Card
          :itemData="reward" 
          :itemType="'reward'" 
          @start-edit="startEditing(reward)"
          @unlock-reward="!editingId ? unlockReward(toRaw(reward)) : null" 
        />
      </template>

      <!-- Render EditItem if editing a specific reward -->
      <template v-else>
        <EditItem 
          :itemType="'reward'" 
          v-model="editedItemData" 
          @save="saveEditing"
          @cancel="cancelEditing"
          @delete="deleteEditing"
        />
      </template>
    </div>

    <div class="addRewardWrapper" @click="addReward()">
      <PlusIcon class="addIcon" />
    </div>
  </div>
</template>