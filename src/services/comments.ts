import api from "./api";
import { Comment } from "../types/comment";

export const commentsService = {
  async getAll(slug: string): Promise<Comment[]> {
    const response = await api.get<{ comments: Comment[] }>(
      `/articles/${slug}/comments`,
    );
    return response.data.comments;
  },

  async add(slug: string, body: string): Promise<Comment> {
    const response = await api.post<{ comment: Comment }>(
      `/articles/${slug}/comments`,
      { comment: { body } },
    );
    return response.data.comment;
  },

  async delete(slug: string, commentId: number): Promise<void> {
    await api.delete(`/articles/${slug}/comments/${commentId}`);
  },
};
