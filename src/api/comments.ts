import { get, post, del } from "./agent";
import type { Comment } from "../types";

interface CommentsResponse {
  comments: Comment[];
}

interface CommentResponse {
  comment: Comment;
}

export const CommentsApi = {
  getAll(slug: string): Promise<Comment[]> {
    return get<CommentsResponse>(`/articles/${slug}/comments`).then(
      (res) => res.comments,
    );
  },

  add(slug: string, body: string): Promise<Comment> {
    return post<CommentResponse>(`/articles/${slug}/comments`, {
      comment: { body },
    }).then((res) => res.comment);
  },

  delete(commentId: string, slug: string): Promise<void> {
    return del<void>(`/articles/${slug}/comments/${commentId}`);
  },
};
