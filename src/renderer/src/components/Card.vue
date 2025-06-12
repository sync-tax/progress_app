<script setup>
// ========== IMPORTS ==========
// Icons
import EditIcon from '../assets/edit.svg';
import IdeaIcon from '../assets/idea.svg';
import ArrowIcon from '../assets/arrow.svg';
// Composables
import { useDates } from '../../../shared/helpers/useDate'; // Added for isSameDateAsToday
import { useRanks } from '../../../shared/helpers/useRanks';

// ========== DATA ==========
const props = defineProps({
    itemData: {
        type: Object,
        required: true
    },
    itemType: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['start-edit', 'move-item', 'unlock-reward', 'idea-to-project', 'toggle-completion']); // Added 'toggle-completion'

const { getToday } = useDates(); // Added for checkbox
const { getTagRank, getHabitRank } = useRanks();
</script>

<template>
    <div class="cardWrapper">
        <!-- IDEA -->
        <template v-if="itemType === 'ideas'">
            <div class="bulbWrapper">
                <IdeaIcon class="bulb" @click="emit('idea-to-project')" />
            </div>

            <div class="ideaContent">
                <h4>{{ itemData.title }}</h4>
                <p>{{ itemData.description }}</p>
            </div>
        </template>

        <!-- TAG -->
        <template v-if="itemType === 'tags'">
            <div class="rankGems">
                <img v-if="getTagRank(itemData) == 'legendary'" src="../assets/LEGENDARY_MARK.png" alt="tagIcon"
                    class="rankMark" :class="getTagRank(itemData) + '-glow'">
                <img v-if="getTagRank(itemData) == 'epic'" src="../assets/EPIC_MARK.png" alt="tagIcon" class="rankMark"
                    :class="getTagRank(itemData) + '-glow'">
                <img v-if="getTagRank(itemData) == 'rare'" src="../assets/RARE_MARK.png" alt="tagIcon" class="rankMark"
                    :class="getTagRank(itemData) + '-glow'">
                <img v-if="getTagRank(itemData) == 'uncommon'" src="../assets/UNCOMMON_MARK.png" alt="tagIcon"
                    class="rankMark" :class="getTagRank(itemData) + '-glow'">
                <img v-if="getTagRank(itemData) == 'common'" src="../assets/COMMON_MARK.png" alt="tagIcon"
                    class="rankMark" :class="getTagRank(itemData) + '-glow'">
            </div>
            <div class="tagContent">
                <div class="cardContent">
                    <h4>
                        {{ itemData.title }}
                    </h4>
                    <p class="tagLvl">
                        Level {{ itemData.level }}
                    </p>
                </div>
            </div>
            <progress class="expBar" :value="itemData.exp_current" :max="itemData.exp_needed">
                EXP
            </progress>
        </template>

        <!-- HABIT -->
        <template v-if="itemType === 'habits'">
            <div class="rankGems">
                <img v-if="getHabitRank(itemData) == 'legendary'" src="../assets/LEGENDARY_MARK.png" alt="habitRankIcon"
                    class="rankMark" :class="getHabitRank(itemData) + '-glow'">
                <img v-if="getHabitRank(itemData) == 'epic'" src="../assets/EPIC_MARK.png" alt="habitRankIcon"
                    class="rankMark" :class="getHabitRank(itemData) + '-glow'">
                <img v-if="getHabitRank(itemData) == 'rare'" src="../assets/RARE_MARK.png" alt="habitRankIcon"
                    class="rankMark" :class="getHabitRank(itemData) + '-glow'">
                <img v-if="getHabitRank(itemData) == 'uncommon'" src="../assets/UNCOMMON_MARK.png" alt="habitRankIcon"
                    class="rankMark" :class="getHabitRank(itemData) + '-glow'">
                <img v-if="getHabitRank(itemData) == 'common'" src="../assets/COMMON_MARK.png" alt="habitRankIcon"
                    class="rankMark" :class="getHabitRank(itemData) + '-glow'">
            </div>
            <div class="habitCardContent">
                <div class="habitCompletionWrapper">
                    <input type="checkbox" :checked="itemData.last_month_completed[itemData.last_month_completed.length - 1] === getToday()"
                        @change="emit('toggle-completion', itemData)" class="habitCheckbox" />
                    <h4 class="habitTitle">{{ itemData.title }}</h4>
                </div>
                <p class="habitTag">#{{ itemData.tag_name }}</p>
                <p class="habitStreak">Streak: {{ itemData.current_streak || 0 }}</p>
            </div>
        </template>

        <!-- STACK -->
        <template v-if="itemType === 'habit_stacks'">
            <h2 class="habitStackTitle">{{ itemData.title }}</h2>
        </template>

        <!-- REWARD -->
        <template v-if="itemType === 'rewards'">
            <div class="costWrapper" @click="emit('unlock-reward')">
                <img src="../assets/crystal.png" alt="crystal cost">
                <p>{{ itemData.cost }}</p>
            </div>
            <div class="cardContent">
                <h4>{{ itemData.title }}</h4>
            </div>
        </template>
        <div class="editIconContainer" @click="emit('start-edit')">
            <EditIcon class="editIcon" />
        </div>
        <div class="moveIconContainer">
            <ArrowIcon class="moveIcon moveUpIcon" :class="{ 'nestedMoveUpIcon': itemType === 'habits' || itemType === 'todo_items' }" @click="emit('move-item', 'up')" />
            <ArrowIcon class="moveIcon moveDownIcon" :class="{ 'nestedMoveDownIcon': itemType === 'habits' || itemType === 'todo_items' }" @click="emit('move-item', 'down')" />
        </div>
    </div>
</template>
