import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Comment } from "../../types";

interface ArticleCommentProps {
  comment: Comment;
  onDelete: () => void;
}

export function ArticleComment({ comment, onDelete }: ArticleCommentProps) {
  const { currentUser } = useAuth();
  const canModify = currentUser?.username === comment.author.username;

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link
          className="comment-author"
          to={`/profile/${comment.author.username}`}
        >
          <img
            src={comment.author.image}
            className="comment-author-img"
            alt={comment.author.username}
          />
        </Link>
        &nbsp;
        <Link
          className="comment-author"
          to={`/profile/${comment.author.username}`}
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
        {canModify && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={onDelete}></i>
          </span>
        )}
      </div>
    </div>
  );
}
