import api from "./api";
import { Profile } from "../types/profile";

export const profilesService = {
  async get(username: string): Promise<Profile> {
    const response = await api.get<{ profile: Profile }>(
      `/profiles/${username}`,
    );
    return response.data.profile;
  },

  async follow(username: string): Promise<Profile> {
    const response = await api.post<{ profile: Profile }>(
      `/profiles/${username}/follow`,
    );
    return response.data.profile;
  },

  async unfollow(username: string): Promise<Profile> {
    const response = await api.delete<{ profile: Profile }>(
      `/profiles/${username}/follow`,
    );
    return response.data.profile;
  },
};
