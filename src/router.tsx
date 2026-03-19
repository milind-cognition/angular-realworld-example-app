import { createBrowserRouter } from "react-router-dom";
import { AuthGuard } from "./components/guards/AuthGuard";
import { SuspenseWrapper } from "./components/SuspenseWrapper";
import App from "./App";
import {
  Home,
  Auth,
  Settings,
  Editor,
  Article,
  Profile,
  ProfileArticles,
  ProfileFavorites,
} from "./pages/lazy";

/**
 * Route structure mirrors the Angular app's app.routes.ts and profile.routes.ts:
 *
 *   /                           → Home (public)
 *   /login                      → Auth (guests only)
 *   /register                   → Auth (guests only)
 *   /settings                   → Settings (authenticated)
 *   /editor                     → Editor - new article (authenticated)
 *   /editor/:slug               → Editor - edit article (authenticated)
 *   /article/:slug              → Article (public)
 *   /profile/:username          → Profile with nested:
 *     /profile/:username           → ProfileArticles
 *     /profile/:username/favorites → ProfileFavorites
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: "login",
        element: (
          <SuspenseWrapper>
            <AuthGuard requireAuth={false}>
              <Auth />
            </AuthGuard>
          </SuspenseWrapper>
        ),
      },
      {
        path: "register",
        element: (
          <SuspenseWrapper>
            <AuthGuard requireAuth={false}>
              <Auth />
            </AuthGuard>
          </SuspenseWrapper>
        ),
      },
      {
        path: "settings",
        element: (
          <SuspenseWrapper>
            <AuthGuard requireAuth={true}>
              <Settings />
            </AuthGuard>
          </SuspenseWrapper>
        ),
      },
      {
        path: "editor",
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <AuthGuard requireAuth={true}>
                  <Editor />
                </AuthGuard>
              </SuspenseWrapper>
            ),
          },
          {
            path: ":slug",
            element: (
              <SuspenseWrapper>
                <AuthGuard requireAuth={true}>
                  <Editor />
                </AuthGuard>
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: "article/:slug",
        element: (
          <SuspenseWrapper>
            <Article />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile/:username",
        element: (
          <SuspenseWrapper>
            <Profile />
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <ProfileArticles />
              </SuspenseWrapper>
            ),
          },
          {
            path: "favorites",
            element: (
              <SuspenseWrapper>
                <ProfileFavorites />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);
