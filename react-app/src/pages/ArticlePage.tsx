import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { marked } from "marked";
import { useAuth } from "../context/AuthContext";
import { ArticlesApi } from "../api/articles";
import { CommentsApi } from "../api/comments";
import { ArticleMeta } from "../components/articles/ArticleMeta";
import { ArticleComment } from "../components/articles/ArticleComment";
import { FavoriteButton } from "../components/articles/FavoriteButton";
import { FollowButton } from "../components/articles/FollowButton";
import { ListErrors } from "../components/shared/ListErrors";
import type { Article, Comment, Errors, Profile } from "../types";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [renderedBody, setRenderedBody] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentErrors, setCommentErrors] = useState<Errors | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canModify = currentUser?.username === article?.author.username;

  useEffect(() => {
    if (!slug) return;

    void Promise.all([
      ArticlesApi.get(slug),
      CommentsApi.getAll(slug),
    ]).then(([fetchedArticle, fetchedComments]) => {
      setArticle(fetchedArticle);
      setComments(fetchedComments);
    });
  }, [slug]);

  const articleBody = article?.body;
  useEffect(() => {
    if (!articleBody) return;

    void (async () => {
      const html = await marked.parse(articleBody);
      setRenderedBody(html);
    })();
  }, [articleBody]);

  const handleDeleteArticle = async () => {
    if (!slug) return;
    await ArticlesApi.delete(slug);
    navigate("/");
  };

  const handleFollowToggle = (updatedProfile: Profile) => {
    setArticle(
      (prev) => prev && { ...prev, author: updatedProfile },
    );
  };

  const handleFavoriteToggle = (favorited: boolean) => {
    setArticle(
      (prev) =>
        prev && {
          ...prev,
          favorited,
          favoritesCount: prev.favoritesCount + (favorited ? 1 : -1),
        },
    );
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    setIsSubmitting(true);
    setCommentErrors(null);
    try {
      const comment = await CommentsApi.add(slug, commentBody);
      setComments((prev) => [comment, ...prev]);
      setCommentBody("");
    } catch (err) {
      setCommentErrors(err as Errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!slug) return;
    await CommentsApi.delete(commentId, slug);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const renderActions = () => {
    if (!article) return null;

    if (canModify) {
      return (
        <>
          <Link
            className="btn btn-outline-secondary btn-sm"
            to={`/editor/${article.slug}`}
          >
            <i className="ion-edit"></i> Edit Article
          </Link>
          &nbsp;&nbsp;
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleDeleteArticle}
          >
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </>
      );
    }

    return (
      <>
        <FollowButton
          profile={article.author}
          onToggle={handleFollowToggle}
        />
        &nbsp;&nbsp;
        <FavoriteButton article={article} onToggle={handleFavoriteToggle}>
          {article.favorited ? "Unfavorite" : "Favorite"} Article (
          {article.favoritesCount})
        </FavoriteButton>
      </>
    );
  };

  if (!article) return null;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <ArticleMeta article={article}>{renderActions()}</ArticleMeta>
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
          <ArticleMeta article={article}>{renderActions()}</ArticleMeta>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <>
                <ListErrors errors={commentErrors} />
                <form className="card comment-form" onSubmit={handleAddComment}>
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
                      src={currentUser?.image}
                      className="comment-author-img"
                      alt={currentUser?.username}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </>
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
