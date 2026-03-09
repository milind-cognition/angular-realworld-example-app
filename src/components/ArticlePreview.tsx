import { Link } from "react-router-dom";
import { Article } from "../types/article";
import { useAuth } from "../context/AuthContext";
import { articlesService } from "../services/articles";
import { useNavigate } from "react-router-dom";

interface ArticlePreviewProps {
  article: Article;
  onFavoriteToggle: (article: Article, favorited: boolean) => void;
}

export function ArticlePreview({
  article,
  onFavoriteToggle,
}: ArticlePreviewProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (article.favorited) {
        await articlesService.unfavorite(article.slug);
        onFavoriteToggle(article, false);
      } else {
        await articlesService.favorite(article.slug);
        onFavoriteToggle(article, true);
      }
    } catch {
      // Error handled silently
    }
  };

  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="article-preview">
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
        <button
          className={`btn btn-sm pull-xs-right ${
            article.favorited ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={handleFavorite}
        >
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>

      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
