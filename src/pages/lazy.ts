import { lazy } from "react";

export const Home = lazy(() => import("./Home"));
export const Auth = lazy(() => import("./Auth"));
export const Settings = lazy(() => import("./Settings"));
export const Editor = lazy(() => import("./Editor"));
export const Article = lazy(() => import("./Article"));
export const Profile = lazy(() => import("./Profile"));
export const ProfileArticles = lazy(() => import("./ProfileArticles"));
export const ProfileFavorites = lazy(() => import("./ProfileFavorites"));
