# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run lint      # Run ESLint
npm run preview   # Serve dist/ locally
```

There is no test suite configured.

## Architecture

React + TypeScript SPA for a Predictive Modeling System dashboard. Vite build tool, Tailwind CSS for styling, lucide-react for icons.

### View Routing

`App.tsx` manages a `currentView` state (type `ViewType`) and renders one of four views based on it. `Sidebar.tsx` receives an `onViewChange` callback to switch views. There is no React Router — just a switch statement in `App.tsx`.

### State Management

- **Local state** (`useState`) for all component-level data
- **ThemeContext** (`src/contexts/ThemeContext.tsx`) for global light/dark mode — persists to `localStorage`, syncs via `document.documentElement.classList`
- No global state library; no backend integration yet — all data is hardcoded mock data

### Key Type Definitions (`src/types/index.ts`)

`ViewType`, `ModelParameter`, `ModelConfig`, `ModelMetrics`, `ModelPerformance`, `PredictionFile`

### Dark Mode

Tailwind is configured with `darkMode: 'class'`. ThemeContext toggles `dark` on `<html>`. Use `dark:` prefix classes for dark variants.

### Current State

All components use hardcoded mock data. Comments in `ParameterInput.tsx` and `Sidebar.tsx` indicate planned AWS backend integration. Form submissions simulate async with a 2-second delay and `console.log` instead of real API calls.
