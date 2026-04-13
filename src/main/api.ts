import { registerMoveItemHandler } from './handlers/moveItem'
import { registerTagHandlers } from './handlers/tags'
import { registerRewardHandlers } from './handlers/rewards'
import { registerQuestlineHandlers } from './handlers/questlines'
import { registerQuestHandlers } from './handlers/quests'
import { registerTaskHandlers } from './handlers/tasks.js'
import { registerUserHandlers } from './handlers/user'
import { registerTimerHandlers } from './handlers/timer'
import { registerStatsHandlers } from './handlers/stats'
import { registerSettingHandlers } from './handlers/settings'

export function registerDBHandlers() {
  registerMoveItemHandler()
  registerTagHandlers()
  registerRewardHandlers()
  registerQuestlineHandlers()
  registerQuestHandlers()
  registerTaskHandlers()
  registerUserHandlers()
  registerTimerHandlers()
  registerStatsHandlers()
  registerSettingHandlers()
}
