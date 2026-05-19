import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Articles, Comments } from "../../api/agent";
import { useAuth } from "../../context/AuthContext";
import type { Article, Comment } from "../../types";
import { ArticleMeta } from "./ArticleMeta";
import { FollowButton } from "./FollowButton";
import { FavoriteButton } from "./FavoriteButton";
import { ArticleComment } from "./ArticleComment";

function ArticleActions({
  article,
  canModify,
  onDelete,
  onToggleFollow,
  onToggleFavorite,
}: {
  article: Article;
  canModify: boolean;
  onDelete: () => void;
  onToggleFollow: (profile: Article["author"]) => void;
  onToggleFavorite: (favorited: boolean) => void;
}) {
  if (canModify) {
    return (
      <ArticleMeta article={article}>
        <Link
          to={`/editor/${article.slug}`}
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="ion-edit" /> Edit Article
        </Link>
        &nbsp;
        <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>
          <i className="ion-trash-a" /> Delete Article
        </button>
      </ArticleMeta>
    );
  }

  return (
    <ArticleMeta article={article}>
      <FollowButton profile={article.author} onToggle={onToggleFollow} />
      &nbsp;
      <FavoriteButton article={article} onToggle={onToggleFavorite}>
        {article.favorited ? "Unfavorite Article" : "Favorite Article"} (
        {article.favoritesCount})
      </FavoriteButton>
    </ArticleMeta>
  );
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!slug) return;

    Articles.get(slug)
      .then(({ article }) => setArticle(article))
      .catch(() => navigate("/"));

    Comments.forArticle(slug).then(({ comments }) => setComments(comments));
  }, [slug, navigate]);

  if (!article) return null;

  const canModify = user !== null && user.username === article.author.username;

  const handleDeleteArticle = async () => {
    await Articles.delete(article.slug);
    navigate("/");
  };

  const handleToggleFollow = (profile: Article["author"]) => {
    setArticle({ ...article, author: profile });
  };

  const handleToggleFavorite = (favorited: boolean) => {
    setArticle({
      ...article,
      favorited,
      favoritesCount: article.favoritesCount + (favorited ? 1 : -1),
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    setSubmittingComment(true);
    try {
      const { comment } = await Comments.create(slug, commentBody);
      setComments([comment, ...comments]);
      setCommentBody("");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!slug) return;
    await Comments.delete(slug, commentId);
    setComments(comments.filter((c) => c.id !== commentId));
  };

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleActions
            article={article}
            canModify={canModify}
            onDelete={handleDeleteArticle}
            onToggleFollow={handleToggleFollow}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked(article.body) as string),
              }}
            />
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleActions
            article={article}
            canModify={canModify}
            onDelete={handleDeleteArticle}
            onToggleFollow={handleToggleFollow}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <form
                className="card comment-form"
                onSubmit={handleSubmitComment}
              >
                <div className="card-block">
                  <textarea
                    className="form-control"
                    placeholder="Write a comment..."
                    rows={3}
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                  />
                </div>
                <div className="card-footer">
                  <img
                    src={user?.image}
                    className="comment-author-img"
                    alt={user?.username}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={submittingComment}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <p>
                <Link to="/login">Sign in</Link> or{" "}
                <Link to="/register">sign up</Link> to add comments on this
                article.
              </p>
            )}

            {comments.map((comment) => (
              <ArticleComment
                key={comment.id}
                comment={comment}
                onDelete={() => handleDeleteComment(comment.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
