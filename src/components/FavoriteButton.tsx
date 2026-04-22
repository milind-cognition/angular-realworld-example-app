import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { articlesService } from "../services/articles";
import type { Article } from "../types";

interface FavoriteButtonProps {
  article: Article;
  onToggle: (favorited: boolean) => void;
  children?: ReactNode;
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
        await articlesService.favorite(article.slug);
      } else {
        await articlesService.unfavorite(article.slug);
      }
      onToggle(!article.favorited);
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnClass = [
    "btn btn-sm",
    isSubmitting ? "disabled" : "",
    article.favorited ? "btn-primary" : "btn-outline-primary",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={btnClass} onClick={handleClick}>
      <i className="ion-heart"></i> {children}
    </button>
  );
}
