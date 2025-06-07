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
}

// ========== HABITS ==========
interface HabitStack {
  id: number
  title: string
  position: number
}

interface Habit {
  id: number
  stack_id: number
  title: string
  position: number
  counter: number
  current_streak: number
  best_streak: number
  tag_name: string
  last_time_completed: Date
}

// ========== TAGS ==========
export interface Tag {
  id: number
  title: string
  level: number
  exp_current: number
  exp_needed: number
  time_spent: number
  created_at: Date
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
  repeatable: boolean
  position: number
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
  habitstacks: HabitStack[]
  habits: Habit[]
  stats: Statistics
  daily_stats: DailyStats[]
  rewards: Reward[]
  achievements: Achievement[]
}
