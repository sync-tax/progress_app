<script setup>
 // ========== IMPORTS ==========
 // Icons
import PlusIcon from '../assets/plus.svg'
// Components
import ModuleTitle from '../components/ModuleTitle.vue'
import Card from '../components/Card.vue'
import EditItem from '../components/EditItem.vue'
import AddItem from '../components/AddItem.vue'
// Composables
import { useBalance } from '../composables/db_functions/useBalance'
import { useRewards } from '../composables/db_functions/useRewards'
import { useToasts } from '../composables/ui/useToasts'
import { useEdit } from '../composables/ui/useEdit'
import { useAdd } from '../composables/ui/useAdd'
// Vue
import { onMounted, onUnmounted, toRaw } from 'vue'

// ========== DATA ==========
const { fetchBalance, onBalanceUpdate } = useBalance()
const { rewards,getRewards, deleteReward, editReward, addReward, unlockReward, onRewardsUpdate } = useRewards()
const { addToast } = useToasts()

let cleanupBalanceUpdate = null
let cleanupRewardsUpdate = null

// ========== LIFECYCLE ==========
onMounted(async () => {
  // get initial rewards data
  await getRewards();
  // set backend listeners
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
} = useEdit({
  editFn: editReward,
  deleteFn: deleteReward
});

// ========== ADDER CONFIGS ==========
const {
  isAdding,
  addedItemData,
  startAdding,
  cancelAdding,
  saveAdding
} = useAdd({
  addFn: addReward,
  itemType: 'reward'
})

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
        /><!-- avoid unlocking while editing -->
      </template>

      <!-- Render EditItem if editing a specific reward -->
      <template v-else>
        <EditItem 
          :itemType="'reward'" 
          v-model="editedItemData" 
          @save-edit="saveEditing()"
          @cancel-edit="cancelEditing()"
          @delete-edit="deleteEditing()"
        />
      </template>
    </div>

    <!-- Render AddIcon -->
     <template v-if="!isAdding">
      <div class="addRewardWrapper" @click="startAdding()">
        <PlusIcon class="addIcon" />
      </div>
     </template>

     <!-- Render AddItem if adding button is clicked -->
     <template v-else>
      <AddItem
        :itemType="'reward'"
        v-model="addedItemData"
        @save-add="saveAdding()"
        @cancel-add="cancelAdding()"
      />
     </template>
  </div>
</template>