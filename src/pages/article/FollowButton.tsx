import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profiles } from "../../api/agent";
import { useAuth } from "../../context/AuthContext";
import type { Profile } from "../../types";

export function FollowButton({
  profile,
  onToggle,
}: {
  profile: Profile;
  onToggle: (profile: Profile) => void;
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      const result = profile.following
        ? await Profiles.unfollow(profile.username)
        : await Profiles.follow(profile.username);
      onToggle(result.profile);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${profile.following ? "btn-secondary" : "btn-outline-secondary"}`}
      onClick={handleClick}
      disabled={submitting}
    >
      <i className="ion-plus-round" />
      &nbsp; {profile.following ? "Unfollow" : "Follow"} {profile.username}
    </button>
  );
}
