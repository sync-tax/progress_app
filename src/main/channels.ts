export const IPC_CHANNELS = {
  // ========= UNIVERSAL =========
  MOVE_ITEM: 'move-item',

  // ========= USER =========
  GET_USER: 'get-user',
  USER_UPDATED: 'user-updated',
  GET_STATS_SNAPSHOT: 'get-stats-snapshot',
  EXPORT_STATS_PDF: 'export-stats-pdf',
  GET_SETTINGS: 'get-settings',
  UPDATE_TIMER_SETTINGS: 'update-timer-settings',
  RESET_TIMER_SETTINGS: 'reset-timer-settings',
  EXPORT_DB_JSON: 'export-db-json',
  SETTINGS_UPDATED: 'settings-updated',

  // ========= TIMER =========
  ADD_TIME: 'add-time',
  TIMER_START: 'timer:start',
  TIMER_STOP: 'timer:stop',
  TIMER_RESET: 'timer:reset',
  TIMER_UPDATE: 'timer:update',
  TIMER_COMPLETE: 'timer:complete',
  TIMER_SET_DURATION: 'timer:set-duration',
  TIMER_GET_STATE: 'timer:get-state',

  // ========== QUESTLINES ==========
  GET_QUESTLINES: 'get-questlines',
  ADD_QUESTLINE: 'add-questline',
  EDIT_QUESTLINE: 'edit-questline',
  DELETE_QUESTLINE: 'delete-questline',
  ACTIVATE_QUESTLINE: 'activate-questline',
  CLAIM_QUESTLINE_REWARD: 'claim-questline-reward',
  CANCEL_QUESTLINE: 'cancel-questline',
  QUESTLINES_UPDATED: 'questlines-updated',

  // ========== QUESTS ==========
  GET_QUESTS: 'get-quests',
  ADD_QUEST: 'add-quest',
  EDIT_QUEST: 'edit-quest',
  DELETE_QUEST: 'delete-quest',
  ACTIVATE_QUEST: 'activate-quest',
  CLAIM_QUEST_REWARD: 'claim-quest-reward',
  QUESTS_UPDATED: 'quests-updated',

  // ========== TASKS ==========
  GET_TASKS: 'get-tasks',
  ADD_TASK: 'add-task',
  EDIT_TASK: 'edit-task',
  DELETE_TASK: 'delete-task',
  TASKS_UPDATED: 'tasks-updated',
  TOGGLE_TASK_COMPLETION: 'toggle-task-completion',

  // ========== TAGS ==========
  GET_TAGS: 'get-tags',
  ADD_TAG: 'add-tag',
  EDIT_TAG: 'edit-tag',
  DELETE_TAG: 'delete-tag',
  TAGS_UPDATED: 'tags-updated',

  // ========== REWARDS ==========
  GET_REWARDS: 'get-rewards',
  ADD_REWARD: 'add-reward',
  EDIT_REWARD: 'edit-reward',
  DELETE_REWARD: 'delete-reward',
  UNLOCK_REWARD: 'redeem-reward',
  REWARDS_UPDATED: 'rewards-updated',
}
