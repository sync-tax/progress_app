<script setup>
// ========== IMPORTS ==========
// Icons
import EditIcon from '../assets/edit.svg';
import IdeaIcon from '../assets/idea.svg';
import ArrowIcon from '../assets/arrow.svg';
// Composables
import { useDates } from '../../../shared/helpers/useDate'; // Added for isSameDateAsToday

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

const { isSameDateAsToday } = useDates(); // Added for checkbox

// ========== FUNCTIONS ========== 
// Initializes edit mode

const handleMoveItem = (direction) => {
    emit('move-item', props.itemData, direction);
}

// ========== HELPERS ========== 
// TODO: move to composables (useRanks)
// Returns rank based on level (TAGS)
const getTagRank = (tag) => { // Renamed from getRank to be specific
    if (tag.level >= 55) return 'legendary';
    else if (tag.level >= 40) return 'epic';
    else if (tag.level >= 25) return 'rare';
    else if (tag.level >= 10) return 'uncommon';
    else return 'common';
};

// Returns rank based on streak and counter (HABITS)
const getHabitRank = (habit) => {
    const score = (habit.best_streak || 0) * (habit.counter || 0);
    if (score >= 2000) return 'legendary';
    else if (score >= 1000) return 'epic';
    else if (score >= 500) return 'rare';
    else if (score >= 100) return 'uncommon';
    else return 'common';
};
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
                    <input type="checkbox" :checked="isSameDateAsToday(itemData.last_time_completed)"
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
            <ArrowIcon class="moveIcon moveUpIcon" @click="emit('move-item', 'up')" />
            <ArrowIcon class="moveIcon moveDownIcon" @click="emit('move-item', 'down')" />
        </div>
    </div>
</template>
