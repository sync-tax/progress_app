// ========== CRYSTALS ==========
export type Balance = number

// ========== PROJECTS ==========
export interface Project {
  id: number
  title: string
  rank: string
  active: boolean
  todo_lists: TodoList[]
}

// ========== TODO LISTS ==========
export interface TodoList {
  id: number
  title: string
  project_id: number
  todo_items: TodoItem[]
  tag_id: number
}

// ========== TODO ITEMS ==========
export interface TodoItem {
  id: number
  title: string
  todo_list_id: number
  completed: boolean
}

// ========== IDEAS ==========
export interface Idea {
  id: number
  title: string
  description: string
  rank: string
}

// ========== HABITS ==========
export interface Habit {
  id: number
  title: string
  counter: number
  streak: number
}

// ========== TAGS ==========
export interface Tag {
  id: number
  title: string
  level: number
  exp_current: number
  exp_needed: number
  time_spent: number
}

// ========== STATISTICS ==========
export interface Statistics {
  focused_time: number
  total_time: number
  pomodoros: number
  projects_done: number
  todos_done: number
  ideas_total: number
  habits_implemented: number
  EXP_gained: number
  crystals_gained: number
}

export interface DailyStats {
  date: string
  focused_time: number
}

// ========== REWARDS ==========
export interface Reward {
  id: number
  title: string
  cost: number
  rank: string
  repeatable: boolean
}

// ========== ACHIEVEMENTS ==========
export interface Achievement {
  id: number
  title: string
  description: string
  unlocked: boolean
}

// ========== FULL DB SCHEMA ==========
export interface DbSchema {
  balance: Balance
  projects: Project[]
  todo_lists: TodoList[]
  todo_items: TodoItem[]
  tags: Tag[]
  ideas: Idea[]
  habits: Habit[]
  stats: Statistics
  daily_stats: DailyStats[]
  rewards: Reward[]
  achievements: Achievement[]
}
