// TODO: Migrate from Angular FollowButtonComponent
import type { Profile } from "../types";

export function FollowButton({
  profile,
  onToggle,
}: {
  profile: Profile;
  onToggle: (profile: Profile) => void;
}) {
  void profile;
  void onToggle;
  return (
    <button className="btn btn-sm action-btn btn-outline-secondary">
      Follow stub
    </button>
  );
}
