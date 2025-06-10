// ========== USER ==========
export interface User {
  balance: number
  level: number
  exp_current: number
  exp_needed: number
  focused_time: number
  total_time: number
  pomodoros: number
  projects_done: number
  todos_done: number
  ideas_total: number
  habits_implemented: number
  EXP_gained: number
  crystals_gained: number
  created_at: string
}

// ========== PROJECTS ==========
export interface Project {
  id: number
  title: string
  rank: string
  time_spent: number
  active: boolean
  todo_lists: TodoList[]
  created_at: string
}

// ========== TODO LISTS ==========
export interface TodoList {
  id: number
  title: string
  project_id: number
  tag_id: number
  position: number
}

// ========== TODO ITEMS ==========
export interface TodoItem {
  id: number
  title: string
  todo_list_id: number
  completed: boolean
  position: number
}

// ========== PROJECTS DONE ========== 
export interface ProjectsDone {
  id: number
  name: string
  created_at: string
}

// ========== IDEAS ==========
export interface Idea {
  id: number
  title: string
  description: string
  position: number
}

// ========== HABITS ==========
export interface HabitStack {
  id: number
  title: string
  position: number
}

export interface Habit {
  id: number
  stack_id: number
  title: string
  counter: number
  current_streak: number
  best_streak: number
  tag_name: string
  last_time_completed: string | null
  position: number
}

// ========== TAGS ==========
export interface Tag {
  id: number
  title: string
  level: number
  exp_current: number
  exp_needed: number
  time_spent: number
  created_at: string
  position: number
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
  user: User
  projects: Project[]
  todo_lists: TodoList[]
  todo_items: TodoItem[]
  tags: Tag[]
  ideas: Idea[]
  habitstacks: HabitStack[]
  habits: Habit[]
  rewards: Reward[]
  achievements: Achievement[]
}
