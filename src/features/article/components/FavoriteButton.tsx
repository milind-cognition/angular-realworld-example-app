import { useFavorite } from "../hooks/useFavorite";
import type { Article } from "../../../types";

interface FavoriteButtonProps {
  article: Article;
  onToggle: (favorited: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function FavoriteButton({
  article,
  onToggle,
  children,
  className = "",
}: FavoriteButtonProps) {
  const { isSubmitting, toggleFavorite } = useFavorite(article, onToggle);

  const buttonClass = [
    "btn btn-sm",
    isSubmitting ? "disabled" : "",
    article.favorited ? "btn-primary" : "btn-outline-primary",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} onClick={toggleFavorite}>
      <i className="ion-heart"></i> {children}
    </button>
  );
}
