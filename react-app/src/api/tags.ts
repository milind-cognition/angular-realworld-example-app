import { get } from "./agent";

interface TagsResponse {
  tags: string[];
}

export const TagsApi = {
  getAll(): Promise<string[]> {
    return get<TagsResponse>("/tags").then((res) => res.tags);
  },
};
