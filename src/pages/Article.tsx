import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { articlesService } from "../services/articles";
import { commentsService } from "../services/comments";
import { ArticleMeta } from "../components/ArticleMeta";
import { ArticleComment } from "../components/ArticleComment";
import { FavoriteButton } from "../components/FavoriteButton";
import { FollowButton } from "../components/FollowButton";
import { ListErrors } from "../components/ListErrors";
import { renderMarkdown } from "../utils/markdown";
import type {
  Article as ArticleType,
  Comment,
  Errors,
  Profile,
} from "../types";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [article, setArticle] = useState<ArticleType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [commentErrors, setCommentErrors] = useState<Errors | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [renderedBody, setRenderedBody] = useState("");

  const canModify = user?.username === article?.author.username;

  useEffect(() => {
    if (!slug) return;

    Promise.all([articlesService.get(slug), commentsService.getAll(slug)])
      .then(([articleData, commentsData]) => {
        setArticle(articleData);
        setComments(commentsData);
      })
      .catch(() => navigate("/"));
  }, [slug, navigate]);

  useEffect(() => {
    if (article?.body) {
      renderMarkdown(article.body).then(setRenderedBody);
    }
  }, [article?.body]);

  const handleToggleFavorite = (favorited: boolean) => {
    if (!article) return;
    setArticle({
      ...article,
      favorited,
      favoritesCount: article.favoritesCount + (favorited ? 1 : -1),
    });
  };

  const handleToggleFollowing = (profile: Profile) => {
    if (!article) return;
    setArticle({
      ...article,
      author: { ...article.author, following: profile.following },
    });
  };

  const handleDeleteArticle = async () => {
    if (!article) return;
    setIsDeleting(true);
    await articlesService.delete(article.slug);
    navigate("/");
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;
    setIsSubmitting(true);
    setCommentErrors(null);

    try {
      const comment = await commentsService.add(article.slug, commentBody);
      setComments((prev) => [comment, ...prev]);
      setCommentBody("");
    } catch (err) {
      setCommentErrors(err as Errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    if (!article) return;
    await commentsService.delete(comment.id, article.slug);
    setComments((prev) => prev.filter((c) => c !== comment));
  };

  if (!article) return null;

  const articleActions = canModify ? (
    <span>
      <Link
        className="btn btn-sm btn-outline-secondary"
        to={`/editor/${article.slug}`}
      >
        <i className="ion-edit"></i> Edit Article
      </Link>

      <button
        className={`btn btn-sm btn-outline-danger${isDeleting ? " disabled" : ""}`}
        onClick={handleDeleteArticle}
      >
        <i className="ion-trash-a"></i> Delete Article
      </button>
    </span>
  ) : (
    <span>
      <FollowButton profile={article.author} onToggle={handleToggleFollowing} />

      <FavoriteButton article={article} onToggle={handleToggleFavorite}>
        {article.favorited ? "Unfavorite" : "Favorite"} Article
        <span className="counter">({article.favoritesCount})</span>
      </FavoriteButton>
    </span>
  );

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article}>{articleActions}</ArticleMeta>
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
          <ArticleMeta article={article}>{articleActions}</ArticleMeta>
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
                      />
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
                onDelete={() => handleDeleteComment(comment)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
