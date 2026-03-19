import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/client";
import { useAuth } from "../../../context/useAuth";
import type { Article } from "../../../types";

interface UseFavoriteResult {
  isSubmitting: boolean;
  toggleFavorite: () => Promise<void>;
}

export function useFavorite(
  article: Article,
  onToggle: (favorited: boolean) => void,
): UseFavoriteResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleFavorite = useCallback(async () => {
    if (isSubmitting) return;

    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!article.favorited) {
        await api.post<{ article: Article }>(
          `/articles/${article.slug}/favorite`,
        );
      } else {
        await api.delete<void>(`/articles/${article.slug}/favorite`);
      }
      onToggle(!article.favorited);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    article.favorited,
    article.slug,
    isAuthenticated,
    isSubmitting,
    navigate,
    onToggle,
  ]);

  return { isSubmitting, toggleFavorite };
}
