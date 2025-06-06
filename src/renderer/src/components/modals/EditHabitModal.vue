<script setup>
import DeleteIcon from '../../assets/delete.svg'

import { useModalActions } from '../../composables/modal_functions/useModalActions'
import { useHabits } from '../../composables/db_functions/useHabits'
import { useTags } from '../../composables/db_functions/useTags'

import { onMounted } from 'vue'

const { habitData, updateHabit, deleteHabit } = useHabits()
const { fetchTags, tags } = useTags()
onMounted(async () => {
    fetchTags()
})

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

habitData.value.title = props.data.title
habitData.value.tag_name = props.data.tag_name

const emit = defineEmits(['close'])

const save = () => {
    if (!habitData.value?.title?.trim()) return

    updateHabit({
        ...props.data,
        title: habitData.value.title,
        tag_name: habitData.value.tag_name
    })

    emit('close')
}

const remove = () => {
    if (!props.data) return
    deleteHabit(props.data.id)
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
            <h4>Edit Habit</h4>
            <input v-model="habitData.title" type="text" placeholder="Title..." spellcheck="false" />

            <select v-model="habitData.tag_name">
                <option v-for="tag in tags" :key="tag.id" :value="tag.title">{{ tag.title }}</option>
            </select>

            <div class="deleteIconContainer" @click="remove">
                <DeleteIcon class="deleteIcon" />
            </div>

            <span>ESC = Cancel | ENTER = Save</span>
        </div>
    </div>
</template>