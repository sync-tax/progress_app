<script setup>
import DeleteIcon from '../../assets/delete.svg'
import { watch } from 'vue'
import { useModalActions } from '../../composables/modal_functions/useModalActions'
import { useIdeas } from '../../composables/db_functions/useIdeas'

const { ideaData, updateIdea, deleteIdea } = useIdeas()

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

// Update local copy when prop changes
watch(
    () => props.data,
    (data) => {
        if (data) {
            ideaData.value.title = data.title
            ideaData.value.description = data.description
            ideaData.value.rank = data.rank
        }
    },
    { immediate: true, deep: true }
)

const emit = defineEmits(['close'])

const save = async () => {
    if (!ideaData.value?.title?.trim()) return

    await updateIdea({
        ...props.data,
        title: ideaData.value.title,
        description: ideaData.value.description,
        rank: ideaData.value.rank
    })

    emit('close')
}

const remove = async () => {
    if (!props.data) return
    await deleteIdea(props.data.id)
    emit('close')
}

const cancel = () => {
    emit('close')
}

useModalActions({
    onSave: () => {
        save()
    },
    onCancel: () => {
        cancel()
    }
})
</script>

<template>
    <div class="modalWrapper">
        <div class="editModal">
            <h4>Edit Idea</h4>
            <input v-model="ideaData.title" type="text" placeholder="Title..." spellcheck="false"
                @keydown.enter="save" />

            <textarea v-model="ideaData.description" placeholder="Description..." rows="3" maxlength="90"
                spellcheck="false"></textarea>

            <select v-model="ideaData.rank">
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
            </select>

            <div class="deleteIconContainer" @click="remove">
                <DeleteIcon class="deleteIcon" />
            </div>

            <span>ESC = Cancel | ENTER = Save</span>
        </div>
    </div>
</template>