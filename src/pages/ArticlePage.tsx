import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Articles, Comments } from "../api/agent";
import { ArticleComment } from "../components/ArticleComment";
import { ArticleMeta } from "../components/ArticleMeta";
import { FavoriteButton } from "../components/FavoriteButton";
import { FollowButton } from "../components/FollowButton";
import { ListErrors } from "../components/ListErrors";
import { useAuth } from "../context/AuthContext";
import type { Article, Comment, Errors, Profile } from "../types";
import { marked } from "marked";
import DOMPurify from "dompurify";

function ArticleActions({
  article,
  canModify,
  isDeleting,
  onDelete,
  onToggleFavorite,
  onToggleFollowing,
}: {
  article: Article;
  canModify: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onToggleFavorite: (favorited: boolean) => void;
  onToggleFollowing: (profile: Profile) => void;
}) {
  if (canModify) {
    return (
      <ArticleMeta article={article}>
        <span>
          <Link
            className="btn btn-sm btn-outline-secondary"
            to={`/editor/${article.slug}`}
          >
            <i className="ion-edit"></i> Edit Article
          </Link>
          <button
            className={`btn btn-sm btn-outline-danger${isDeleting ? " disabled" : ""}`}
            onClick={onDelete}
          >
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </span>
      </ArticleMeta>
    );
  }

  return (
    <ArticleMeta article={article}>
      <span>
        <FollowButton profile={article.author} onToggle={onToggleFollowing} />
        <FavoriteButton article={article} onToggle={onToggleFavorite}>
          {article.favorited ? "Unfavorite" : "Favorite"} Article
          <span className="counter">({article.favoritesCount})</span>
        </FavoriteButton>
      </span>
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
  const [commentErrors, setCommentErrors] = useState<Errors | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [renderedBody, setRenderedBody] = useState("");

  useEffect(() => {
    if (!slug) return;

    Promise.all([Articles.get(slug), Comments.getAll(slug)])
      .then(([a, c]) => {
        setArticle(a);
        setComments(c);
      })
      .catch(() => navigate("/"));
  }, [slug, navigate]);

  useEffect(() => {
    if (article?.body) {
      const html = marked.parse(article.body);
      if (typeof html === "string") {
        setRenderedBody(DOMPurify.sanitize(html));
      } else {
        html.then((resolved) => setRenderedBody(DOMPurify.sanitize(resolved)));
      }
    }
  }, [article?.body]);

  if (!article) return null;

  const canModify = user?.username === article.author.username;

  const handleDeleteArticle = () => {
    setIsDeleting(true);
    Articles.delete(article.slug).then(() => navigate("/"));
  };

  const handleToggleFavorite = (favorited: boolean) => {
    setArticle((prev) =>
      prev
        ? {
            ...prev,
            favorited,
            favoritesCount: prev.favoritesCount + (favorited ? 1 : -1),
          }
        : prev,
    );
  };

  const handleToggleFollowing = (profile: Profile) => {
    setArticle((prev) =>
      prev
        ? { ...prev, author: { ...prev.author, following: profile.following } }
        : prev,
    );
  };

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCommentErrors(null);

    Comments.add(article.slug, commentBody)
      .then((comment) => {
        setComments((prev) => [comment, ...prev]);
        setCommentBody("");
        setIsSubmitting(false);
      })
      .catch((err: Errors) => {
        setCommentErrors(err);
        setIsSubmitting(false);
      });
  };

  const handleDeleteComment = (commentId: string) => {
    Comments.delete(article.slug, commentId).then(() => {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    });
  };

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleActions
            article={article}
            canModify={canModify}
            isDeleting={isDeleting}
            onDelete={handleDeleteArticle}
            onToggleFavorite={handleToggleFavorite}
            onToggleFollowing={handleToggleFollowing}
          />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{ __html: renderedBody }} />
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
            isDeleting={isDeleting}
            onDelete={handleDeleteArticle}
            onToggleFavorite={handleToggleFavorite}
            onToggleFollowing={handleToggleFollowing}
          />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <div>
                <ListErrors errors={commentErrors} />
                <form className="card comment-form" onSubmit={handleAddComment}>
                  <fieldset disabled={isSubmitting}>
                    <div className="card-block">
                      <textarea
                        className="form-control"
                        placeholder="Write a comment..."
                        rows={3}
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="card-footer">
                      <img
                        src={user?.image ?? ""}
                        className="comment-author-img"
                        alt={user?.username}
                      />
                      <button className="btn btn-sm btn-primary" type="submit">
                        Post Comment
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>
            ) : (
              <div>
                <Link to="/login">Sign in</Link> or{" "}
                <Link to="/register">sign up</Link> to add comments on this
                article.
              </div>
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
