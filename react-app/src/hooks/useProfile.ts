import { useState, useEffect, useCallback } from "react";
import type { Profile } from "../types";
import { ProfilesApi } from "../api/profiles";

interface UseProfileResult {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: Profile) => void;
}

export function useProfile(username: string | undefined): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(!!username);
  const [error, setError] = useState<string | null>(null);
  const [prevUsername, setPrevUsername] = useState(username);

  // React-recommended pattern: adjust state during render when props change
  // See https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (prevUsername !== username) {
    setPrevUsername(username);
    setProfile(null);
    setIsLoading(!!username);
    setError(null);
  }

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    ProfilesApi.get(username)
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load profile";
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const updateProfile = useCallback((updated: Profile) => {
    setProfile(updated);
  }, []);

  return { profile, isLoading, error, setProfile: updateProfile };
}
