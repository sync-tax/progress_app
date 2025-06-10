import type { DbSchema } from '../../shared/dbTypes'

const defaultData: DbSchema = {
  balance: 10000,
  projects: [],

  todo_lists: [],

  todo_items: [],

  tags: [
    {
      id: 1,
      title: 'Focus',
      level: 3,
      exp_current: 45,
      exp_needed: 100,
      time_spent: 7200, // in seconds (2 hours)
      created_at: new Date('2025-04-01T10:00:00'),
    },
    {
      id: 2,
      title: 'Strength',
      level: 11,
      exp_current: 120,
      exp_needed: 300,
      time_spent: 14400, // 4 hours
      created_at: new Date('2025-03-15T14:30:00'),
    },
    {
      id: 3,
      title: 'Writing',
      level: 21,
      exp_current: 80,
      exp_needed: 500,
      time_spent: 25200, // 7 hours
      created_at: new Date('2025-02-10T09:15:00'),
    },
    {
      id: 4,
      title: 'Agility',
      level: 35,
      exp_current: 250,
      exp_needed: 1000,
      time_spent: 39600, // 11 hours
      created_at: new Date('2025-01-20T12:45:00'),
    },
    {
      id: 5,
      title: 'Creativity',
      level: 48,
      exp_current: 900,
      exp_needed: 1500,
      time_spent: 57600, // 16 hours
      created_at: new Date('2024-12-05T08:00:00'),
    },
    {
      id: 6,
      title: 'Discipline',
      level: 60,
      exp_current: 1400,
      exp_needed: 2000,
      time_spent: 86400, // 24 hours
      created_at: new Date('2024-11-01T17:20:00'),
    }
  ],

  ideas: [
    {
      id: 1,
      title: "MindGarden",
      description: "A daily journaling app that grows a digital garden from your thoughts over time.",
    },
    {
      id: 2,
      title: "SkillTree",
      description: "Gamify personal development by mapping goals to a visual skill tree with XP and levels.",
    },
    {
      id: 3,
      title: "FocusNest",
      description: "A minimalist Pomodoro timer that rewards focus with ambient nature sounds and visuals.",
    },
    {
      id: 4,
      title: "TaskForge",
      description: "A to-do app where completed tasks forge imaginary weapons—great for RPG fans.",
    },
    {
      id: 5,
      title: "DreamDock",
      description: "A place to log and categorize dreams, with tags, moods, and AI-powered symbolism analysis.",
    },
    {
      id: 6,
      title: "MoodCast",
      description: "A personal weather forecast app that maps your daily mood and habits onto a climate landscape.",
    }
  ],

  habitstacks: [
    {
      id: 1,
      title: 'Morning Routine',
      position: 1,
    },
    {
      id: 2,
      title: 'Work Habits',
      position: 2,
    },
    {
      id: 3,
      title: 'Evening Routine',
      position: 3,
    },
    {
      id: 99999,
      title: 'No Stack',
      position: 4,
    },
  ],

  habits: [
    {
      id: 1,
      stack_id: 1,
      title: 'Meditation',
      position: 1,
      counter: 20,
      current_streak: 5,
      best_streak: 10,
      tag_name: 'Creativity',
      last_time_completed: new Date('2024-06-01T07:00:00'),
    },
    {
      id: 2,
      stack_id: 1,
      title: 'Stretching',
      position: 2,
      counter: 15,
      current_streak: 3,
      best_streak: 8,
      tag_name: 'Creativity',
      last_time_completed: new Date('2024-06-01T07:05:00'),
    },
    {
      id: 3,
      stack_id: 1,
      title: 'Journaling',
      position: 3,
      counter: 10,
      current_streak: 2,
      best_streak: 5,
      tag_name: 'Discipline',
      last_time_completed: new Date('2024-06-01T07:10:00'),
    },
  
    // Habits für Stack 2 (Work Habits)
    {
      id: 4,
      stack_id: 2,
      title: 'Email Check',
      position: 1,
      counter: 30,
      current_streak: 10,
      best_streak: 15,
      tag_name: 'Agility',
      last_time_completed: new Date('2024-06-01T09:00:00'),
    },
    {
      id: 5,
      stack_id: 2,
      title: 'Task Updates',
      position: 2,
      counter: 28,
      current_streak: 7,
      best_streak: 12,
      tag_name: 'Strength',
      last_time_completed: new Date('2024-06-01T09:15:00'),
    },
    {
      id: 6,
      stack_id: 2,
      title: 'Plan Next Day',
      position: 3,
      counter: 22,
      current_streak: 6,
      best_streak: 12,
      tag_name: 'Agility',
      last_time_completed: new Date('2024-06-01T17:00:00'),
    },
  
    // Habits für Stack 3 (Evening Routine)
    {
      id: 7,
      stack_id: 3,
      title: 'Reading',
      position: 1,
      counter: 18,
      current_streak: 4,
      best_streak: 9,
      tag_name: 'Writing',
      last_time_completed: new Date('2024-06-01T20:00:00'),
    },
    {
      id: 8,
      stack_id: 3,
      title: 'Evening Walk',
      position: 2,
      counter: 14,
      current_streak: 3,
      best_streak: 7,
      tag_name: 'Focus',
      last_time_completed: new Date('2024-06-01T20:30:00'),
    },
    {
      id: 9,
      stack_id: 3,
      title: 'Plan Next Day',
      position: 3,
      counter: 16,
      current_streak: 5,
      best_streak: 10,
      tag_name: 'Discipline',
      last_time_completed: new Date('2024-06-01T20:45:00'),
    },
    {
      id: 10,
      stack_id: 3,
      title: 'Gratitude Journaling',
      position: 4,
      counter: 10,
      current_streak: 2,
      best_streak: 5,
      tag_name: 'Creativity',
      last_time_completed: new Date('2024-06-01T21:00:00'),
    },
    {
      id: 11,
      stack_id: 99999,
      title: 'Other',
      position: 1,
      counter: 18,
      current_streak: 4,
      best_streak: 9,
      tag_name: 'Agility',
      last_time_completed: new Date('2024-06-01T21:00:00'),
    },
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
      title: 'Watch',
      cost: 20,
      repeatable: true,
      position: 0,
    },
    {
      id: 2,
      title: 'Snack',
      cost: 500,
      repeatable: true,
      position: 1,
    },
    {
      id: 3,
      title: 'Fap',
      cost: 100,
      repeatable: false,
      position: 2,
    },
    {
      id: 4,
      title: 'Gift',
      cost: 375,
      repeatable: true,
      position: 3,
    },
    {
      id: 5,
      title: 'Trip',
      cost: 1500,
      repeatable: false,
      position: 4,
    },
  ],

  achievements: []
}

export default defaultData
