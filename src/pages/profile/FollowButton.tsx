import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profiles } from "../../api/agent";
import { useAuth } from "../../context/AuthContext";
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
      const { profile: updatedProfile } = profile.following
        ? await Profiles.unfollow(profile.username)
        : await Profiles.follow(profile.username);
      onToggle(updatedProfile);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      className={`btn btn-sm action-btn ${profile.following ? "btn-secondary" : "btn-outline-secondary"}`}
      onClick={handleClick}
      disabled={isSubmitting}
    >
      <i className="ion-plus-round" />
      &nbsp; {profile.following ? "Unfollow" : "Follow"} {profile.username}
    </button>
  );
}
