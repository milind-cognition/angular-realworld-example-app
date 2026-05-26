[![RealWorld Frontend](https://img.shields.io/badge/realworld-frontend-%23783578.svg)](https://realworld.show)

# ![React Example App](logo.png)

> ### React + TypeScript codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

### [RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged application built with **React 19**, **TypeScript**, and **Vite** that interacts with an actual backend server including CRUD operations, authentication, routing, pagination, and more.

Migrated from Angular 20 to React 19 with the following stack:

- **React 19** with functional components and hooks
- **React Router v7** for client-side routing with auth guards
- **Context API** for authentication state management
- **Fetch-based API layer** with JWT token management
- **Vite** for fast development and optimized builds
- **TypeScript** in strict mode
- **Marked** + **DOMPurify** for secure markdown rendering
- **ESLint** with React-specific plugins

# How it works

The app uses a clean architecture with the following structure:

- `src/api/` — API client with fetch-based HTTP layer and JWT interceptor
- `src/context/` — React Context for auth state (user, login, register, logout)
- `src/components/` — Reusable UI components (Header, Footer, ArticleList, etc.)
- `src/pages/` — Route-level page components (Home, Login, Editor, etc.)
- `src/types/` — TypeScript interfaces for all domain models

# Getting started

Make sure you have Node.js 20+ installed.

```bash
npm install
npm run dev
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Building the project

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Linting

```bash
npm run lint
```

## Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication. You can view a live demo over at https://demo.realworld.show

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout button on settings page)
- CRU\* users (sign up & settings page - no deleting required)
- CRUD Articles
- CR\*D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

**The general page breakdown looks like this:**

- Home page (URL: / )
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
  - Pagination for list of articles
- Sign in/Sign up pages (URL: /login, /register )
  - Uses JWT (store the token in localStorage)
- Settings page (URL: /settings )
- Editor page to create/edit articles (URL: /editor, /editor/article-slug-here )
- Article page (URL: /article/article-slug-here )
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
- Profile page (URL: /profile/:username )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles

<br />

[![Brought to you by Thinkster](https://raw.githubusercontent.com/gothinkster/realworld/master/media/end.png)](https://thinkster.io)
