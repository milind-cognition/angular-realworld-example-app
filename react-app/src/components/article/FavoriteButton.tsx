import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArticlesApi } from "../../api/articles";
import type { Article } from "../../types";

interface FavoriteButtonProps {
  article: Article;
  onToggle: (favorited: boolean) => void;
  children: React.ReactNode;
}

export function FavoriteButton({
  article,
  onToggle,
  children,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    setIsSubmitting(true);
    try {
      if (article.favorited) {
        await ArticlesApi.unfavorite(article.slug);
        onToggle(false);
      } else {
        await ArticlesApi.favorite(article.slug);
        onToggle(true);
      }
    } catch {
      // silently handle error
    } finally {
      setIsSubmitting(false);
    }
  }

  const buttonClass = [
    "btn btn-sm",
    isSubmitting ? "disabled" : "",
    article.favorited ? "btn-primary" : "btn-outline-primary",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-heart"></i> {children}
    </button>
  );
}
