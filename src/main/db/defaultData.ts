import type { DbSchema } from '../../shared/dbTypes'

const defaultData: DbSchema = {
  balance: 10000,
  projects: [
    {
      id: 1,
      title: 'Test Project',
      rank: 'common',
      active: true,
      todo_lists: []
    }
  ],

  todo_lists: [
    {
      id: 1,
      title: 'Test Todo List',
      project_id: 1,
      todo_items: [],
      tag_id: 1
    }
  ],

  todo_items: [
    {
      id: 1,
      title: 'Test Todo Item',
      todo_list_id: 1,
      completed: false
    }
  ],
  tags: [
    {
      id: 1,
      title: 'Test Tag',
      level: 1,
      exp_current: 0,
      exp_needed: 100,
      time_spent: 0
    }
  ],
  ideas: [
    {
      id: 1,
      title: 'Test Idea',
      description: 'A test idea to see how ideas display',
      rank: 'common'
    }
  ],
  habits: [
    {
      id: 1,
      title: 'Test Habit',
      counter: 0,
      streak: 0
    }
  ],
  stats: {
    focused_time: 0,
    total_time: 0,
    pomodoros: 0,
    projects_done: 0,
    todos_done: 0,
    ideas_total: 0,
    habits_implemented: 0,
    EXP_gained: 0,
    crystals_gained: 0
  },
  daily_stats: [],
  rewards: [
    {
      id: 1,
      title: 'Test Repeat Reward',
      cost: 100,
      rank: 'common',
      repeatable: true
    },
    {
      id: 2,
      title: 'Test No Repeat Reward',
      cost: 200,
      rank: 'rare',
      repeatable: false
    }
  ],
  achievements: [
    {
      id: 1,
      title: 'Test Achievement',
      description: 'This is a test achievement',
      unlocked: false
    }
  ]
}

export default defaultData
