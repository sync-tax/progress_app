<script setup>
import PlusIcon from '../assets/plus.svg'

import IdeaCard from '../components/cards/IdeaCard.vue'
import AddIdeaModal from '../components/modals/AddIdeaModal.vue'
import EditIdeaModal from '../components/modals/EditIdeaModal.vue'

import { onMounted } from 'vue'

import { useIdeas } from '../composables/db_functions/useIdeas'
import { useAddModalVisibility } from '../composables/modal_functions/useAddModalVisibility'
import { useEditModalVisibility } from '../composables/modal_functions/useEditModalVisibility'

const { fetchIdeas, ideas } = useIdeas()
onMounted(async () => {
  fetchIdeas()
})

const { isVisible: addModalVisible, showModal: showAddModal, hideModal: hideAddModal } = useAddModalVisibility(fetchIdeas)
const { isVisible: editModalVisible, showModal: showEditModal, hideModal: hideEditModal, editedData } = useEditModalVisibility(fetchIdeas)
</script>

<template>
  <div class="moduleTitle">
    <h1>Ideas</h1>
  </div>


  <div id="ideasWrapper" class="moduleWrapper">
    <IdeaCard v-for="idea in ideas" :key="idea.id" :idea="idea" @edit="showEditModal(idea)" />
    <div class="addIdeaWrapper" @click="showAddModal()">
      <PlusIcon class="addIcon" />
    </div>
  </div>

  <AddIdeaModal v-if="addModalVisible" @close="hideAddModal()" />
  <EditIdeaModal v-if="editModalVisible && editedData" type="idea" :data="editedData" @close="hideEditModal()" />
</template>