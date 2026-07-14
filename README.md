# React Authentication Form - Round 2

## Overview

This project is the Round 2 implementation of my AI Workflow assignment.

Unlike Round 1, this version was built using detailed AI prompts, an implementation plan, constraints, verification, testing, and manual code review. The goal was to improve correctness, accessibility, maintainability, and user experience.

## Features

- Login form
- Signup form
- Forgot Password workflow
- LocalStorage-based authentication (simulation)
- Form validation
- Password visibility toggle
- Loading states during form submission
- Success and error messages
- Clickable image thumbnails
- Accessibility improvements
  - Semantic buttons
  - Screen-reader labels
  - Keyboard focus indicators
  - ARIA attributes
  - Reduced-motion support
- Automated tests using React Testing Library

## Project Files

- `WORKFLOW.md` – Comparison between Round 1 and Round 2
- `CLAUDE.md` – Project-specific AI prompting rules

## Tech Stack

- React
- JavaScript
- CSS
- React Testing Library

## Run the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open your browser at:

http://localhost:3000

Run the tests:

```bash
npm test -- --watchAll=false
```

## Branch

workflow-round-2

## Improvements over Round 1

- Added Forgot Password workflow
- Improved validation and error handling
- Added loading states
- Added accessibility improvements
- Added automated tests
- Improved AI prompting workflow using planning, constraints, verification, and review
- Fixed a CSS specificity issue that affected the UI after accessibility changes

## Author

Hafsa Akram