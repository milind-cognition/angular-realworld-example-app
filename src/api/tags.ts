import { api } from "./agent";

export const TagsApi = {
  getAll(): Promise<string[]> {
    return api.get<{ tags: string[] }>("/tags").then((data) => data.tags);
  },
};
