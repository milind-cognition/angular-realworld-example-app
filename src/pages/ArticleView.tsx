import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { Article } from "../types/article";
import { Comment } from "../types/comment";
import { articlesService } from "../services/articles";
import { commentsService } from "../services/comments";
import { profilesService } from "../services/profiles";
import { useAuth } from "../context/AuthContext";

export function ArticleView() {
  const { slug } = useParams<{ slug: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!slug) return;

    articlesService.get(slug).then(setArticle);
    commentsService.getAll(slug).then(setComments);
  }, [slug]);

  if (!article) {
    return <div className="article-page">Loading...</div>;
  }

  const isAuthor = currentUser?.username === article.author.username;
  const markup = { __html: marked(article.body) as string };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await articlesService.delete(article.slug);
      navigate("/");
    } catch {
      setIsDeleting(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const profile = article.author.following
        ? await profilesService.unfollow(article.author.username)
        : await profilesService.follow(article.author.username);
      setArticle({ ...article, author: profile });
    } catch {
      // Error handled silently
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      if (article.favorited) {
        await articlesService.unfavorite(article.slug);
        setArticle({
          ...article,
          favorited: false,
          favoritesCount: article.favoritesCount - 1,
        });
      } else {
        const updated = await articlesService.favorite(article.slug);
        setArticle(updated);
      }
    } catch {
      // Error handled silently
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !commentBody.trim()) return;

    try {
      const comment = await commentsService.add(slug, commentBody);
      setComments([comment, ...comments]);
      setCommentBody("");
    } catch {
      // Error handled silently
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!slug) return;
    try {
      await commentsService.delete(slug, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      // Error handled silently
    }
  };

  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" },
  );

  const articleActions = (
    <>
      {isAuthor ? (
        <>
          <Link
            to={`/editor/${article.slug}`}
            className="btn btn-sm btn-outline-secondary"
          >
            <i className="ion-edit"></i> Edit Article
          </Link>
          &nbsp;
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </>
      ) : (
        <>
          <button
            className={`btn btn-sm ${article.author.following ? "btn-secondary" : "btn-outline-secondary"}`}
            onClick={handleFollow}
          >
            <i className="ion-plus-round"></i>&nbsp;
            {article.author.following ? "Unfollow" : "Follow"}{" "}
            {article.author.username}
          </button>
          &nbsp;
          <button
            className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
            onClick={handleFavorite}
          >
            <i className="ion-heart"></i>&nbsp;
            {article.favorited ? "Unfavorite" : "Favorite"} Article{" "}
            <span className="counter">({article.favoritesCount})</span>
          </button>
        </>
      )}
    </>
  );

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img
                src={article.author.image || "https://api.realworld.io/images/smiley-cyrus.jpeg"}
                alt={article.author.username}
              />
            </Link>
            <div className="info">
              <Link
                to={`/profile/${article.author.username}`}
                className="author"
              >
                {article.author.username}
              </Link>
              <span className="date">{formattedDate}</span>
            </div>
            {articleActions}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={markup} />
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
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img
                src={article.author.image || "https://api.realworld.io/images/smiley-cyrus.jpeg"}
                alt={article.author.username}
              />
            </Link>
            <div className="info">
              <Link
                to={`/profile/${article.author.username}`}
                className="author"
              >
                {article.author.username}
              </Link>
              <span className="date">{formattedDate}</span>
            </div>
            {articleActions}
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <form className="card comment-form" onSubmit={handleAddComment}>
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
                    src={currentUser?.image || "https://api.realworld.io/images/smiley-cyrus.jpeg"}
                    className="comment-author-img"
                    alt={currentUser?.username}
                  />
                  <button className="btn btn-sm btn-primary" type="submit">
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
              <div className="card" key={comment.id}>
                <div className="card-block">
                  <p className="card-text">{comment.body}</p>
                </div>
                <div className="card-footer">
                  <Link
                    to={`/profile/${comment.author.username}`}
                    className="comment-author"
                  >
                    <img
                      src={comment.author.image || "https://api.realworld.io/images/smiley-cyrus.jpeg"}
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
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {currentUser?.username === comment.author.username && (
                    <span className="mod-options">
                      <i
                        className="ion-trash-a"
                        onClick={() => handleDeleteComment(comment.id)}
                      ></i>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
