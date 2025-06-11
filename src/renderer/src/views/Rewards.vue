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
import { useUniversals } from '../composables/db_functions/useUniversals'
import { useUser } from '../composables/db_functions/useUser'
import { useRewards } from '../composables/db_functions/useRewards'
import { useEdit } from '../composables/ui/useEdit'
import { useAdd } from '../composables/ui/useAdd'
import { useSort } from '../composables/ui/useSort'
// Vue
import { onMounted, onUnmounted, toRaw, ref } from 'vue'

// ========== DATA ==========
const { getItems, deleteItem, moveItem } = useUniversals()
const { getBalance, onBalanceUpdate } = useUser()
const { editReward, addReward, unlockReward, onRewardsUpdate } = useRewards()
const { sortByPosition } = useSort()

let cleanupBalanceUpdate = null
let cleanupRewardsUpdate = null

const rewards = ref([])

// ========== LIFECYCLE ==========
onMounted(async () => {
  // get initial rewards data
  rewards.value = sortByPosition(await getItems('rewards'))

  // set backend listeners
  cleanupBalanceUpdate = onBalanceUpdate(async () => {
    await getBalance()
  })
  cleanupRewardsUpdate = onRewardsUpdate(async () => {
    rewards.value = sortByPosition(await getItems('rewards'))
  })
});

onUnmounted(async () => {
  // cleanup listeners
  if (cleanupBalanceUpdate) {
    await cleanupBalanceUpdate();
  }
  if (cleanupRewardsUpdate) {
    await cleanupRewardsUpdate();
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
  deleteFn: deleteItem,
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
  itemType: 'rewards'
})

</script>

<template>
  <ModuleTitle title="Rewards" />

  <div id="rewardsWrapper" class="moduleWrapper">
    <div v-for="reward in rewards" :key="reward.id" class="rewardItemContainer">
      <!-- Show Card if not editing a specific reward -->
      <template v-if="editingId !== reward.id">
        <Card :itemData="reward" :itemType="'rewards'" @start-edit="startEditing(reward, 'rewards')"
          @unlock-reward="!editingId ? unlockReward(toRaw(reward)) : null" 
          @move-item="moveItem(reward, 'rewards', $event)"
        />
      </template>
      <!-- Show EditItem if editing a specific reward -->
      <template v-else>
        <EditItem :itemType="'rewards'" v-model="editedItemData" @save-edit="saveEditing()"
          @cancel-edit="cancelEditing()" @delete-edit="deleteEditing()" />
      </template>
    </div>

    <!-- Show AddIcon -->
    <template v-if="!isAdding">
      <div class="addRewardWrapper" @click="startAdding()">
        <PlusIcon class="addIcon" />
      </div>
    </template>
    <!-- Show AddItem if adding button is clicked -->
    <template v-else>
      <AddItem :itemType="'rewards'" v-model="addedItemData" @save-add="saveAdding()" @cancel-add="cancelAdding()" />
    </template>
  </div>
</template>