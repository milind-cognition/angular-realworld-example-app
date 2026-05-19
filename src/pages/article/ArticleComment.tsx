import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Comment } from "../../types";

export function ArticleComment({
  comment,
  onDelete,
}: {
  comment: Comment;
  onDelete: () => void;
}) {
  const { user } = useAuth();
  const canDelete = user !== null && user.username === comment.author.username;

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link
          to={`/profile/${comment.author.username}`}
          className="comment-author"
        >
          <img
            src={comment.author.image}
            className="comment-author-img"
            alt={comment.author.username}
          />
        </Link>
        &nbsp;
        <Link
          to={`/profile/${comment.author.username}`}
          className="comment-author"
        >
          {comment.author.username}
        </Link>
        <span className="date-posted">
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        {canDelete && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={onDelete} />
          </span>
        )}
      </div>
    </div>
  );
}
