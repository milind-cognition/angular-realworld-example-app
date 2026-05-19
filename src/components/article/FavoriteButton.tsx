import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Article } from "../../types";
import { Articles } from "../../api/agent";
import { useAuth } from "../../context/AuthContext";

interface FavoriteButtonProps {
  article: Article;
  onToggle: (favorited: boolean) => void;
  children: ReactNode;
}

export function FavoriteButton({
  article,
  onToggle,
  children,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    setSubmitting(true);
    try {
      if (article.favorited) {
        await Articles.unfavorite(article.slug);
        onToggle(false);
      } else {
        await Articles.favorite(article.slug);
        onToggle(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const btnClass = article.favorited ? "btn-primary" : "btn-outline-primary";

  return (
    <button
      className={`btn btn-sm ${btnClass}`}
      onClick={handleClick}
      disabled={submitting}
    >
      <i className="ion-heart"></i>
      {children}
    </button>
  );
}
