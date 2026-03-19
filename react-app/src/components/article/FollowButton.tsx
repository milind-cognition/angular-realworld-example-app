import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ProfilesApi } from "../../api/profiles";
import type { Profile } from "../../types";

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
    try {
      const updatedProfile = profile.following
        ? await ProfilesApi.unfollow(profile.username)
        : await ProfilesApi.follow(profile.username);
      onToggle(updatedProfile);
    } catch {
      // silently handle error
    } finally {
      setIsSubmitting(false);
    }
  }

  const buttonClass = [
    "btn btn-sm action-btn",
    isSubmitting ? "disabled" : "",
    profile.following ? "btn-secondary" : "btn-outline-secondary",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {profile.following ? "Unfollow" : "Follow"} {profile.username}
    </button>
  );
}
