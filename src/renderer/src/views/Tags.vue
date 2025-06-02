<script setup>
import PlusIcon from '../assets/plus.svg'

import TagCard from '../components/cards/TagCard.vue'
import AddTagModal from '../components/modals/AddTagModal.vue'
import EditTagModal from '../components/modals/EditTagModal.vue'
// import composables
import { useTags } from '../composables/db_functions/useTags'
import { useAddModalVisibility } from '../composables/modal_functions/useAddModalVisibility'
import { useEditModalVisibility } from '../composables/modal_functions/useEditModalVisibility'

import { onMounted } from 'vue'
// uses needed parts of db composables (useTags)
const { fetchTags, sortedTags } = useTags()
onMounted(async () => {
  fetchTags()
})
// uses needed parts of modal composables (useAddModalVisibility, useEditModalVisibility)
const { isVisible: addModalVisible, showModal: showAddModal, hideModal: hideAddModal } = useAddModalVisibility(fetchTags)
const { isVisible: editModalVisible, showModal: showEditModal, hideModal: hideEditModal, editedData } = useEditModalVisibility(fetchTags)
</script>

<template>
  <div class="moduleTitle">
    <h1>
      Tags
    </h1>
  </div>

  <div id="tagsWrapper" class="moduleWrapper">
    <!-- iterates over sortedTags array and renders TagCard for each tag -->
    <!-- @edit="showEditModal(tag)" emits showEditModal event with selected tag data - passes the tag data to EditModal -->
    <TagCard v-for="tag in sortedTags" :key="tag.id" :tag="tag" @edit="showEditModal(tag)" />
    <div class="addTagWrapper" @click="showAddModal()">
      <PlusIcon class="addIcon" />
    </div>
  </div>
  <AddTagModal v-if="addModalVisible" @close="hideAddModal()" />
  <!-- visible when editModalVisible is true and editedData is not null - e.g. was passed to EditModal -->
  <EditTagModal v-if="editModalVisible && editedData" :data="editedData" @close="hideEditModal()" />
</template>