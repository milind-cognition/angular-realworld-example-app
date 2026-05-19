import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Articles } from "../../api/agent";
import { useAuth } from "../../context/AuthContext";
import type { Article } from "../../types";

export function FavoriteButton({
  article,
  onToggle,
  children,
}: {
  article: Article;
  onToggle: (favorited: boolean) => void;
  children: ReactNode;
}) {
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

  return (
    <button
      className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
      onClick={handleClick}
      disabled={submitting}
    >
      <i className="ion-heart" />
      &nbsp; {children}
    </button>
  );
}
