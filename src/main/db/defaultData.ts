import type { DbSchema } from '../../shared/dbTypes'

const defaultData: DbSchema = {
  "user": {
    "balance": 14872,
    "level": 12,
    "exp_current": 500,
    "exp_needed": 2410,
    "focused_time": 3600,
    "total_time": 12600,
    "pomodoros": 10,
    "projects_done": 2,
    "todos_done": 6,
    "ideas_total": 3,
    "habits_implemented": 3,
    "EXP_gained": 500,
    "crystals_gained": 20,
    "created_at": "2025-06-01T10:00:00Z"
  },
  "projects": [
    {
      "id": 1,
      "title": "Fitness Tracker",
      "rank": "A",
      "time_spent": 1200,
      "active": true,
      "todo_lists": [],
      "created_at": "2025-06-01T10:00:00Z"
    },
    {
      "id": 2,
      "title": "Blog Website",
      "rank": "B",
      "time_spent": 800,
      "active": false,
      "todo_lists": [],
      "created_at": "2025-06-02T12:00:00Z"
    },
    {
      "id": 3,
      "title": "Language Learning",
      "rank": "S",
      "time_spent": 2400,
      "active": true,
      "todo_lists": [],
      "created_at": "2025-06-03T09:00:00Z"
    }
  ],
  "todo_lists": [
    {
      "id": 1,
      "title": "Setup Backend",
      "project_id": 1,
      "tag_id": 1,
      "position": 0
    },
    {
      "id": 2,
      "title": "Write Articles",
      "project_id": 2,
      "tag_id": 2,
      "position": 1
    },
    {
      "id": 3,
      "title": "Review Vocabulary",
      "project_id": 3,
      "tag_id": 3,
      "position": 2
    }
  ],
  "todo_items": [
    {
      "id": 1,
      "title": "Design DB Schema",
      "todo_list_id": 1,
      "completed": false,
      "position": 0
    },
    {
      "id": 2,
      "title": "Deploy API",
      "todo_list_id": 1,
      "completed": true,
      "position": 1
    },
    {
      "id": 3,
      "title": "Translate 10 words",
      "todo_list_id": 3,
      "completed": false,
      "position": 0
    }
  ],
  "tags": [
    {
      "id": 1,
      "title": "Programming",
      "level":34,
      "exp_current": 30,
      "exp_needed": 100,
      "time_spent": 1500,
      "created_at": "2025-06-01T08:00:00Z",
      "position": 0
    },
    {
      "id": 2,
      "title": "Writing",
      "level": 14,
      "exp_current": 60,
      "exp_needed": 100,
      "time_spent": 1000,
      "created_at": "2025-06-02T11:00:00Z",
      "position": 1
    },
    {
      "id": 3,
      "title": "Language",
      "level": 47,
      "exp_current": 20,
      "exp_needed": 150,
      "time_spent": 2000,
      "created_at": "2025-06-03T07:00:00Z",
      "position": 2
    }
  ],
  "ideas": [
    {
      "id": 1,
      "title": "Build AI chatbot",
      "description": "A personal assistant chatbot to track tasks and habits.",
      "position": 0
    },
    {
      "id": 2,
      "title": "Publish eBook",
      "description": "Summarize blog posts and turn them into an eBook.",
      "position": 1
    },
    {
      "id": 3,
      "title": "Travel Journal App",
      "description": "App to log travel stories and share with friends.",
      "position": 2
    }
  ],
  "habitstacks": [
    {
      "id": 1,
      "title": "Morning Routine",
      "position": 0
    },
    {
      "id": 2,
      "title": "Evening Reflection",
      "position": 1
    },
    {
      "id": 3,
      "title": "Work Focus",
      "position": 2
    }
  ],
  "habits": [
    {
      "id": 1,
      "stack_id": 1,
      "title": "Meditation",
      "counter": 10,
      "current_streak": 5,
      "best_streak": 7,
      "tag_name": "Language",
      "last_time_completed": "2025-06-09T07:00:00Z",
      "position": 0
    },
    {
      "id": 2,
      "stack_id": 2,
      "title": "Journal Entry",
      "counter": 15,
      "current_streak": 3,
      "best_streak": 8,
      "tag_name": "Writing",
      "last_time_completed": "2025-06-09T21:00:00Z",
      "position": 1
    },
    {
      "id": 3,
      "stack_id": 3,
      "title": "Deep Work Session",
      "counter": 20,
      "current_streak": 6,
      "best_streak": 10,
      "tag_name": "Programming",
      "last_time_completed": "2025-06-09T15:00:00Z",
      "position": 2
    }
  ],
  "rewards": [
    {
      "id": 1,
      "title": "Watch a Movie",
      "cost": 50,
      "repeatable": true,
      "position": 0
    },
    {
      "id": 2,
      "title": "Buy Coffee",
      "cost": 30,
      "repeatable": true,
      "position": 1
    },
    {
      "id": 3,
      "title": "Day Off",
      "cost": 100,
      "repeatable": false,
      "position": 2
    }
  ],
  "achievements": [
    {
      "id": 1,
      "title": "First Pomodoro",
      "description": "Complete your first Pomodoro session.",
      "unlocked": true
    },
    {
      "id": 2,
      "title": "Project Master",
      "description": "Complete 3 projects.",
      "unlocked": false
    },
    {
      "id": 3,
      "title": "Habit Streaker",
      "description": "Maintain a 7-day habit streak.",
      "unlocked": true
    }
  ]
}

export default defaultData