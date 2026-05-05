// TODO: Migrate from Angular FavoriteButtonComponent
import type { Article } from "../types";
import type { ReactNode } from "react";

export function FavoriteButton({
  article,
  onToggle,
  children,
}: {
  article: Article;
  onToggle: (favorited: boolean) => void;
  children?: ReactNode;
}) {
  void article;
  void onToggle;
  return <button className="btn btn-sm btn-outline-primary">{children}</button>;
}
