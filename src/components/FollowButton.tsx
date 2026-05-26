import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profiles } from "../api/agent";
import { useAuth } from "../context/AuthContext";
import type { Profile } from "../types";

interface FollowButtonProps {
  profile: Profile;
  onToggle: (profile: Profile) => void;
}

export function FollowButton({ profile, onToggle }: FollowButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = profile.following
        ? await Profiles.unfollow(profile.username)
        : await Profiles.follow(profile.username);
      onToggle(updated);
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
