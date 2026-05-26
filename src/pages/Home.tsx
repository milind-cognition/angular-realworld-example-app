import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tags } from "../api/agent";
import { ArticleList } from "../components/ArticleList";
import { useAuth } from "../context/AuthContext";
import type { ArticleListConfig } from "../types";

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [listType, setListType] = useState<string>(
    isAuthenticated ? "feed" : "all",
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    Tags.getAll()
      .then(setTags)
      .finally(() => setTagsLoaded(true));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setListType("feed");
    } else {
      setListType("all");
    }
    setActiveTag(null);
  }, [isAuthenticated]);

  const setListTo = (type: string, tag?: string) => {
    if (type === "feed" && !isAuthenticated) {
      navigate("/login");
      return;
    }
    setListType(type);
    setActiveTag(tag ?? null);
  };

  const config: ArticleListConfig = useMemo(
    () => ({
      type: activeTag ? "all" : listType,
      filters: activeTag ? { tag: activeTag } : {},
    }),
    [listType, activeTag],
  );

  return (
    <div className="home-page">
      {!isAuthenticated && (
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
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
                      className={`nav-link${listType === "feed" && !activeTag ? " active" : ""}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setListTo("feed")}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    className={`nav-link${listType === "all" && !activeTag ? " active" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setListTo("all")}
                  >
                    Global Feed
                  </a>
                </li>
                {activeTag && (
                  <li className="nav-item">
                    <a className="nav-link active">
                      <i className="ion-pound"></i> {activeTag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList limit={10} config={config} />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              {!tagsLoaded && <div>Loading tags...</div>}

              {tagsLoaded && tags.length === 0 && (
                <div>No tags are here... yet.</div>
              )}

              <div className="tag-list">
                {tags.map((tag) => (
                  <a
                    key={tag}
                    className="tag-default tag-pill"
                    style={{ cursor: "pointer" }}
                    onClick={() => setListTo("all", tag)}
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
