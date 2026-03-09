import api from "./api";

export const tagsService = {
  async getAll(): Promise<string[]> {
    const response = await api.get<{ tags: string[] }>("/tags");
    return response.data.tags;
  },
};
