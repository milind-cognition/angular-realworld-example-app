import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Profile } from "../../types";
import { ProfilesApi } from "../../api/profiles";
import { useAuth } from "../../context/AuthContext";

interface FollowButtonProps {
  profile: Profile;
  onToggle: (profile: Profile) => void;
}

export function FollowButton({ profile, onToggle }: FollowButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    // Optimistic update
    const optimisticProfile: Profile = {
      ...profile,
      following: !profile.following,
    };
    onToggle(optimisticProfile);

    try {
      const updatedProfile = profile.following
        ? await ProfilesApi.unfollow(profile.username)
        : await ProfilesApi.follow(profile.username);
      onToggle(updatedProfile);
    } catch {
      // Revert on error
      onToggle(profile);
    } finally {
      setIsSubmitting(false);
    }
  }

  const buttonClass = profile.following
    ? "btn btn-sm action-btn btn-secondary"
    : "btn btn-sm action-btn btn-outline-secondary";

  return (
    <button
      className={buttonClass}
      disabled={isSubmitting}
      onClick={handleClick}
    >
      <i className="ion-plus-round" />
      &nbsp;
      {profile.following ? "Unfollow" : "Follow"} {profile.username}
    </button>
  );
}
