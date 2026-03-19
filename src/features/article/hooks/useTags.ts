import { useState, useEffect } from "react";
import { api } from "../../../api/client";

interface UseTagsResult {
  tags: string[];
  isLoading: boolean;
}

export function useTags(): UseTagsResult {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ tags: string[] }>("/tags")
      .then(({ tags }) => setTags(tags))
      .catch(() => setTags([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { tags, isLoading };
}
