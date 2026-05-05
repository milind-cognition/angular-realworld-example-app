import { api } from "./agent";
import type { Profile } from "../types";

export const ProfileApi = {
  get(username: string): Promise<Profile> {
    return api
      .get<{ profile: Profile }>(`/profiles/${username}`)
      .then((data) => data.profile);
  },

  follow(username: string): Promise<Profile> {
    return api
      .post<{ profile: Profile }>(`/profiles/${username}/follow`)
      .then((data) => data.profile);
  },

  unfollow(username: string): Promise<Profile> {
    return api
      .del<{ profile: Profile }>(`/profiles/${username}/follow`)
      .then((data) => data.profile);
  },
};
