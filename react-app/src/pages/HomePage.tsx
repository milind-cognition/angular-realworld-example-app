import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TagsApi } from "../api/tags";
import { ArticleList } from "../components/articles/ArticleList";
import type { ArticleListConfig } from "../types";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [prevAuth, setPrevAuth] = useState(isAuthenticated);
  const [listConfig, setListConfig] = useState<ArticleListConfig>({
    type: isAuthenticated ? "feed" : "all",
    filters: {},
  });

  if (prevAuth !== isAuthenticated) {
    setPrevAuth(isAuthenticated);
    setListConfig({
      type: isAuthenticated ? "feed" : "all",
      filters: {},
    });
  }

  const [tags, setTags] = useState<string[]>([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);

  useEffect(() => {
    TagsApi.getAll().then((data) => {
      setTags(data);
      setTagsLoaded(true);
    });
  }, []);

  function setListTo(type: string, filters: Record<string, string> = {}) {
    if (type === "feed" && !isAuthenticated) {
      void navigate("/login");
      return;
    }
    setListConfig({ type, filters });
  }

  return (
    <div className="home-page">
      {!isAuthenticated && (
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>
              A place to share your <i>React</i> knowledge.
            </p>
          </div>
        </div>
      )}

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuthenticated && (
                  <li className="nav-item">
                    <a
                      className={`nav-link${listConfig.type === "feed" ? " active" : ""}`}
                      onClick={() => setListTo("feed")}
                      style={{ cursor: "pointer" }}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    className={`nav-link${listConfig.type === "all" && !listConfig.filters.tag ? " active" : ""}`}
                    onClick={() => setListTo("all")}
                    style={{ cursor: "pointer" }}
                  >
                    Global Feed
                  </a>
                </li>
                {listConfig.filters.tag && (
                  <li className="nav-item">
                    <a className="nav-link active">
                      <i className="ion-pound"></i> {listConfig.filters.tag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList limit={10} config={listConfig} />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {tags.map((tag) => (
                  <a
                    key={tag}
                    className="tag-default tag-pill"
                    onClick={() => setListTo("all", { tag })}
                    style={{ cursor: "pointer" }}
                  >
                    {tag}
                  </a>
                ))}
              </div>

              {!tagsLoaded && <div>Loading tags...</div>}

              {tagsLoaded && tags.length === 0 && (
                <div>No tags are here... yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
