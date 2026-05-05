import { get, post, del } from "./agent";
import type { Profile } from "../types";

interface ProfileResponse {
  profile: Profile;
}

export const ProfilesApi = {
  get(username: string): Promise<Profile> {
    return get<ProfileResponse>(`/profiles/${username}`).then(
      (res) => res.profile,
    );
  },

  follow(username: string): Promise<Profile> {
    return post<ProfileResponse>(`/profiles/${username}/follow`).then(
      (res) => res.profile,
    );
  },

  unfollow(username: string): Promise<Profile> {
    return del<ProfileResponse>(`/profiles/${username}/follow`).then(
      (res) => res.profile,
    );
  },
};
