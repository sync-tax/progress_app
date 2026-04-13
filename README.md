# Progress v0.1 (MVP)

My personal gamified productivity app. Allows for tracking habits, projects, ideas, tags and much more. I am already using it for a while and i love it!

However it might still be confusing for users who don't know whats going on under the hood. Will add improvements with time.
(btw. Editing mode is hidden -> hit e on keyboard lol)

---

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS (did not test)
$ npm run build:mac

# For Linux (did not test)
$ npm run build:linux
```

Find the .exe file in the dist -> win-unpacked folder

---

## Tech-Stack

- Electron
- Vue
- Pinia
- Vite
- Lowdb

---

## Modules

### Timer
<img width="500" alt="grafik" src="https://github.com/user-attachments/assets/102df394-197c-47fa-aead-0ed821423155" />

Tracks focused time with a flexible session length. You can start, stop and reset sessions, or manually add time if needed. Logged time is applied to the currently active project flow and feeds the progression system.

### Projects
<img width="500" alt="grafik" src="https://github.com/user-attachments/assets/8a2c3cc0-c550-4b08-8850-8603f1a5a3c7" />


This is the main planning module. Projects are structured into projects, epics and tasks. Epics can be linked to one or two skills, tasks can be completed directly, and finished work rewards the user with EXP and crystals.

### Skills
<img width="500" alt="grafik" src="https://github.com/user-attachments/assets/26499746-6ffe-43b3-9f82-2f20e2b8df70" />


Skills represent the areas you want to grow in real life. They gain EXP and levels through focused project work and use the same rarity-style rank system as the rest of the app.

### Rewards
<img width="500" alt="grafik" src="https://github.com/user-attachments/assets/2c04a215-432c-4acf-bfba-2d4f6c2d83dc" />


You can define your own rewards, assign a crystal cost and choose whether they are repeatable or one-time. Rewards can be claimed once you have enough crystals.

### Statistics
<img width="500" alt="grafik" src="https://github.com/user-attachments/assets/6ef69f17-0081-42f2-9117-51390fa5069c" />


Provides a higher-level overview of the current account and activity data. It includes focus time summaries, XP and crystal totals, skill distribution, project progress and a yearly activity heatmap. The statistics view can also be exported as a PDF.

### Settings
<img width="500" alt="grafik" src="https://github.com/user-attachments/assets/af8b9257-fe3b-4966-8cfe-e3ec0f505b03" />

Contains the small set of system-level options that currently matter: timer limits, default session length and data export. You can also export the local database as a JSON backup.

---

## Future Improvements

**Code Cleanup**

- Extract code from Views -> Abstraction
- ❓ ...

**Features**

- Add Settings
  - € to Crystals conversion 4 rewards
  - ❓...

**UI/UX**

- Rework Settings UI
- Improve Projects Module Usability & UI
- ❓Replace Drag Delete with Overlay ("Do you really want to delete xxx?")
- ❓...

---

## Bug Log

- [] 13.04.2026: Statistics Heatmap 1 day behind
- [] 13.04.2026: Having 0 Projects leads to no action possible in "Projects" Module
