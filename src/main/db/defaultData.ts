import { useDates } from '../../shared/helpers/useDate'
import type { DbSchema } from '../../shared/dbTypes'

const { getToday } = useDates()

const defaultData: DbSchema = {
  "user": {
    "balance": 0,
    "level": 1,
    "exp_current": 0,
    "exp_needed": 60,
    "focused_time": 0,
    "pomodoros": 0,
    "projects_done": 0,
    "todos_done": 0,
    "ideas_total": 0,
    "habits_implemented": 0,
    "exp_gained": 0,
    "crystals_gained": 0,
    "rewards_unlocked": 0,
    "created_at": getToday()
  },
  "projects": [
    {
      "id": 1,
      "title": "Build App",
      "description": "Description for project 1.",
      "time_spent": 231,
      "completed": false,
      "active": true,
      "created_at": "2025-06-12",
      "position": 0
    },
    {
      "id": 2,
      "title": "Read Book",
      "description": "Description for project 2.",
      "time_spent": 89,
      "completed": false,
      "active": false,
      "created_at": "2025-06-12",
      "position": 1
    },
    {
      "id": 2,
      "title": "Read Book",
      "description": "Description for project 2.",
      "time_spent": 4242,
      "completed": false,
      "active": false,
      "created_at": "2025-06-12",
      "position": 1
    }
  ],
  "todo_lists": [
    { "id": 1, "title": "List 1", "project_id": 1, "tag_name": "Focus", "time_spent": 45, "position": 0 },
    { "id": 2, "title": "List 2", "project_id": 1, "tag_name": "Health", "time_spent": 120, "position": 1 },
    { "id": 3, "title": "List 3", "project_id": 1, "tag_name": "Work", "time_spent": 180, "position": 2 },
    { "id": 4, "title": "List 1", "project_id": 2, "tag_name": "Learn", "time_spent": 240, "position": 0 },
    { "id": 5, "title": "List 2", "project_id": 2, "tag_name": "Mind", "time_spent": 300, "position": 1 },
    { "id": 6, "title": "List 3", "project_id": 2, "tag_name": "Body", "time_spent": 360, "position": 2 },
  ],
  "todo_items": [
    { "id": 1, "title": "Todo 1", "todo_list_id": 1, "completed": false, "position": 0 },
    { "id": 2, "title": "Todo 2", "todo_list_id": 1, "completed": false, "position": 1 },
    { "id": 3, "title": "Todo 3", "todo_list_id": 1, "completed": false, "position": 2 },
    { "id": 4, "title": "Todo 1", "todo_list_id": 2, "completed": false, "position": 0 },
    { "id": 5, "title": "Todo 2", "todo_list_id": 2, "completed": false, "position": 1 },
    { "id": 6, "title": "Todo 3", "todo_list_id": 2, "completed": false, "position": 2 }
  ],
  "tags": [
    { "id": 1, "title": "Focus", "level": 33, "exp_current": 0, "exp_needed": 100, "time_spent": 0, "created_at": "2025-06-12", "position": 0 },
    { "id": 2, "title": "Health", "level": 13, "exp_current": 0, "exp_needed": 100, "time_spent": 0, "created_at": "2025-06-12", "position": 1 },
    { "id": 3, "title": "Work", "level": 54, "exp_current": 0, "exp_needed": 100, "time_spent": 0, "created_at": "2025-06-12", "position": 2 },
    { "id": 4, "title": "Learn", "level": 37, "exp_current": 0, "exp_needed": 100, "time_spent": 0, "created_at": "2025-06-12", "position": 3 },
    { "id": 5, "title": "Mind", "level": 15, "exp_current": 0, "exp_needed": 100, "time_spent": 0, "created_at": "2025-06-12", "position": 4 },
    { "id": 6, "title": "Body", "level": 28, "exp_current": 0, "exp_needed": 100, "time_spent": 0, "created_at": "2025-06-12", "position": 5 },
    { "id": 7, "title": "Code", "level": 48, "exp_current": 0, "exp_needed": 100, "time_spent": 0, "created_at": "2025-06-12", "position": 6 },
    { "id": 8, "title": "Create", "level": 59, "exp_current": 0, "exp_needed": 100, "time_spent": 0, "created_at": "2025-06-12", "position": 7 }
  ],
  "ideas": [
    { "id": 1, "title": "Idea 1", "description": "Description for idea 1.", "position": 0 },
    { "id": 2, "title": "Idea 2", "description": "Description for idea 2.", "position": 1 },
    { "id": 3, "title": "Idea 3", "description": "Description for idea 3.", "position": 2 },
    { "id": 4, "title": "Idea 4", "description": "Description for idea 4.", "position": 3 },
    { "id": 5, "title": "Idea 5", "description": "Description for idea 5.", "position": 4 },
    { "id": 6, "title": "Idea 6", "description": "Description for idea 6.", "position": 5 },
    { "id": 7, "title": "Idea 7", "description": "Description for idea 7.", "position": 6 }
  ],
  "habit_stacks": [
    { "id": 1, "title": "Morning", "position": 0 },
    { "id": 2, "title": "Evening", "position": 1 },
    { "id": 3, "title": "Other", "position": 2 }
  ],
  "habits": [
    { "id": 1, "stack_id": 1, "title": "Stretch", "counter": 0, "current_streak": 3, "best_streak": 0, "tag_name": "Focus", "last_month_completed": ["2025-06-12"], "position": 0 },
    { "id": 2, "stack_id": 2, "title": "Read", "counter": 0, "current_streak": 4, "best_streak": 0, "tag_name": "Health", "last_month_completed": ["2025-06-12"], "position": 0 },
    { "id": 3, "stack_id": 3, "title": "Code", "counter": 0, "current_streak": 6, "best_streak": 0, "tag_name": "Work", "last_month_completed": ["2025-06-10"], "position": 0 },
    { "id": 4, "stack_id": 1, "title": "Write", "counter": 0, "current_streak": 2, "best_streak": 0, "tag_name": "Learn", "last_month_completed": ["2025-06-11"], "position": 1 },
    { "id": 5, "stack_id": 2, "title": "Walk", "counter": 0, "current_streak": 3, "best_streak": 0, "tag_name": "Mind", "last_month_completed": ["2025-06-12"], "position": 1 },
    { "id": 6, "stack_id": 3, "title": "Plan", "counter": 0, "current_streak": 5, "best_streak": 0, "tag_name": "Body", "last_month_completed": ["2025-06-11"], "position": 1 },
    { "id": 7, "stack_id": 1, "title": "Meditate", "counter": 0, "current_streak": 1, "best_streak": 0, "tag_name": "Code", "last_month_completed": ["2025-06-12"], "position": 2 },
    { "id": 8, "stack_id": 2, "title": "Clean", "counter": 0, "current_streak": 0, "best_streak": 0, "tag_name": "Create", "last_month_completed": [], "position": 2 }
  ],
  "rewards": [
    { "id": 1, "title": "Book", "cost": 154, "repeatable": true, "position": 0 },
    { "id": 2, "title": "Coffee", "cost": 220, "repeatable": true, "position": 1 },
    { "id": 3, "title": "Snack", "cost": 45, "repeatable": true, "position": 2 },
    { "id": 4, "title": "Game", "cost": 610, "repeatable": true, "position": 3 },
    { "id": 5, "title": "Rest", "cost": 120, "repeatable": true, "position": 4 },
    { "id": 6, "title": "Walk", "cost": 90, "repeatable": true, "position": 5 },
    { "id": 7, "title": "Gift", "cost": 320, "repeatable": true, "position": 6 },
    { "id": 8, "title": "Music", "cost": 85, "repeatable": true, "position": 7 },
    { "id": 9, "title": "Movie", "cost": 450, "repeatable": true, "position": 8 }
  ],
  "achievements": [
    { "id": 1, "title": "First Step", "description": "Completed your first task", "unlocked": false },
    { "id": 2, "title": "Getting Started", "description": "Completed your first project", "unlocked": false }
  ],
  "projects_done": [
    { "id": 1, "name": "Old Project", "created_at": "2025-06-11", "time_spent": 120 }
  ]
}

export default defaultData