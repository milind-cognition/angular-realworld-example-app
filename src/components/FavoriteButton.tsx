import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Articles } from "../api/agent";
import { useAuth } from "../context/AuthContext";
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
  className,
}: FavoriteButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!article.favorited) {
        await Articles.favorite(article.slug);
      } else {
        await Articles.unfavorite(article.slug);
      }
      onToggle(!article.favorited);
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnClass = [
    "btn btn-sm",
    article.favorited ? "btn-primary" : "btn-outline-primary",
    isSubmitting ? "disabled" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={btnClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-heart"></i> {children}
    </button>
  );
}
