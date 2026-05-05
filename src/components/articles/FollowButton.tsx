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

  const handleClick = async () => {
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
      // silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnClass = [
    "btn btn-sm action-btn",
    profile.following ? "btn-secondary" : "btn-outline-secondary",
    isSubmitting ? "disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={btnClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {profile.following ? "Unfollow" : "Follow"} {profile.username}
    </button>
  );
}
