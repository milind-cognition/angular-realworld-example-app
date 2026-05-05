import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArticlesApi } from "../../api/articles";
import type { Article } from "../../types";

interface FavoriteButtonProps {
  article: Article;
  onToggle: (favorited: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export function FavoriteButton({
  article,
  onToggle,
  children,
  className = "",
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!article.favorited) {
        await ArticlesApi.favorite(article.slug);
      } else {
        await ArticlesApi.unfavorite(article.slug);
      }
      onToggle(!article.favorited);
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnClass = [
    "btn btn-sm",
    article.favorited ? "btn-primary" : "btn-outline-primary",
    isSubmitting ? "disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={btnClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-heart"></i> {children}
    </button>
  );
}
