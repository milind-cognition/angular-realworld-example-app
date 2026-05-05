// TODO: Migrate from Angular ArticleCommentComponent
import type { Comment } from "../types";

export function ArticleComment({
  comment,
  onDelete,
}: {
  comment: Comment;
  onDelete: () => void;
}) {
  void comment;
  void onDelete;
  return <div className="card">Comment stub</div>;
}
