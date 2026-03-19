import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArticlesApi } from "../api/articles";
import { CommentsApi } from "../api/comments";
import { ArticleMeta } from "../components/article/ArticleMeta";
import { ArticleComment } from "../components/article/ArticleComment";
import { FavoriteButton } from "../components/article/FavoriteButton";
import { FollowButton } from "../components/article/FollowButton";
import { ListErrors } from "../components/shared/ListErrors";
import { renderMarkdown } from "../utils/markdown";
import type { Article, Comment, Errors, Profile } from "../types";

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
          disabled={isDeleting}
        >
          <i className="ion-trash-a"></i> Delete Article
        </button>
      </span>
    );
  }

  return (
    <span>
      <FollowButton profile={article.author} onToggle={onToggleFollowing} />

      <FavoriteButton article={article} onToggle={onToggleFavorite}>
        {article.favorited ? "Unfavorite" : "Favorite"} Article
        <span className="counter">({article.favoritesCount})</span>
      </FavoriteButton>
    </span>
  );
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentFormErrors, setCommentFormErrors] = useState<Errors | null>(
    null,
  );
  const [renderedBody, setRenderedBody] = useState("");

  const canModify = currentUser?.username === article?.author.username;

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!slug || hasLoaded.current) return;
    hasLoaded.current = true;

    async function loadArticle() {
      try {
        const [fetchedArticle, fetchedComments] = await Promise.all([
          ArticlesApi.get(slug!),
          CommentsApi.getAll(slug!),
        ]);
        setArticle(fetchedArticle);
        setComments(fetchedComments);
      } catch {
        navigate("/");
      }
    }

    void loadArticle();
  }, [slug, navigate]);

  useEffect(() => {
    if (!article?.body) return;
    let cancelled = false;
    renderMarkdown(article.body).then((html) => {
      if (!cancelled) setRenderedBody(html);
    });
    return () => {
      cancelled = true;
    };
  }, [article?.body]);

  function handleToggleFavorite(favorited: boolean) {
    if (!article) return;
    setArticle({
      ...article,
      favorited,
      favoritesCount: article.favoritesCount + (favorited ? 1 : -1),
    });
  }

  function handleToggleFollowing(profile: Profile) {
    if (!article) return;
    setArticle({
      ...article,
      author: { ...article.author, following: profile.following },
    });
  }

  async function handleDeleteArticle() {
    if (!article) return;
    setIsDeleting(true);
    try {
      await ArticlesApi.delete(article.slug);
      navigate("/");
    } catch {
      setIsDeleting(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!article) return;

    setIsSubmitting(true);
    setCommentFormErrors(null);

    try {
      const comment = await CommentsApi.add(article.slug, commentBody);
      setComments([comment, ...comments]);
      setCommentBody("");
    } catch (err) {
      setCommentFormErrors(err as Errors);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteComment(comment: Comment) {
    if (!article) return;
    try {
      await CommentsApi.delete(comment.id, article.slug);
      setComments(comments.filter((c) => c !== comment));
    } catch {
      // silently handle error
    }
  }

  if (!article) {
    return null;
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <ArticleMeta article={article}>
            <ArticleActions
              article={article}
              canModify={canModify}
              isDeleting={isDeleting}
              onDelete={handleDeleteArticle}
              onToggleFavorite={handleToggleFavorite}
              onToggleFollowing={handleToggleFollowing}
            />
          </ArticleMeta>
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
          <ArticleMeta article={article}>
            <ArticleActions
              article={article}
              canModify={canModify}
              isDeleting={isDeleting}
              onDelete={handleDeleteArticle}
              onToggleFavorite={handleToggleFavorite}
              onToggleFollowing={handleToggleFollowing}
            />
          </ArticleMeta>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <div>
                <ListErrors errors={commentFormErrors} />
                <form className="card comment-form" onSubmit={handleAddComment}>
                  <fieldset disabled={isSubmitting}>
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
                        src={currentUser?.image || ""}
                        className="comment-author-img"
                        alt={currentUser?.username}
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
                onDelete={() => handleDeleteComment(comment)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
