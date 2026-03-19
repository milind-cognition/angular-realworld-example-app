import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { useTags } from "../hooks/useTags";
import { ArticleList } from "../components/ArticleList";
import type { ArticleListConfig } from "../../../types";

type FeedType = "feed" | "all" | "tag";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { tags, isLoading: tagsLoading } = useTags();

  const [feedType, setFeedType] = useState<FeedType>(
    isAuthenticated ? "feed" : "all",
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const listConfig: ArticleListConfig = useMemo(() => {
    if (feedType === "tag" && selectedTag) {
      return { type: "all", filters: { tag: selectedTag } };
    }
    return { type: feedType, filters: {} };
  }, [feedType, selectedTag]);

  const handleSetFeed = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setFeedType("feed");
    setSelectedTag(null);
  }, [isAuthenticated, navigate]);

  const handleSetGlobal = useCallback(() => {
    setFeedType("all");
    setSelectedTag(null);
  }, []);

  const handleSelectTag = useCallback((tag: string) => {
    setFeedType("tag");
    setSelectedTag(tag);
  }, []);

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
                      className={`nav-link${feedType === "feed" ? " active" : ""}`}
                      onClick={handleSetFeed}
                      style={{ cursor: "pointer" }}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    className={`nav-link${feedType === "all" && !selectedTag ? " active" : ""}`}
                    onClick={handleSetGlobal}
                    style={{ cursor: "pointer" }}
                  >
                    Global Feed
                  </a>
                </li>
                {selectedTag && (
                  <li className="nav-item">
                    <a className="nav-link active">
                      <i className="ion-pound"></i> {selectedTag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList config={listConfig} limit={10} />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              {tagsLoading ? (
                <div>Loading tags...</div>
              ) : tags.length === 0 ? (
                <div>No tags are here... yet.</div>
              ) : (
                <div className="tag-list">
                  {tags.map((tag) => (
                    <a
                      key={tag}
                      className="tag-default tag-pill"
                      onClick={() => handleSelectTag(tag)}
                      style={{ cursor: "pointer" }}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
