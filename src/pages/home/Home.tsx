import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ArticleListConfig } from "../../types";
import { Tags } from "../../api/agent";
import { useAuth } from "../../context/AuthContext";
import { ArticleList } from "../../components/article/ArticleList";

type TabType = "feed" | "all" | "tag";

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(
    isAuthenticated ? "feed" : "all",
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    Tags.getAll().then((data) => setTags(data.tags));
  }, []);

  useEffect(() => {
    setActiveTab(isAuthenticated ? "feed" : "all");
    setSelectedTag(null);
  }, [isAuthenticated]);

  const handleTabClick = (tab: TabType) => {
    if (tab === "feed" && !isAuthenticated) {
      navigate("/login");
      return;
    }
    setActiveTab(tab);
    if (tab !== "tag") {
      setSelectedTag(null);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab("tag");
  };

  const listConfig: ArticleListConfig = useMemo(() => {
    if (activeTab === "feed") {
      return { type: "feed", filters: {} };
    }
    if (activeTab === "tag" && selectedTag) {
      return { type: "all", filters: { tag: selectedTag } };
    }
    return { type: "all", filters: {} };
  }, [activeTab, selectedTag]);

  return (
    <div className="home-page">
      <style>{`.nav-link { cursor: pointer; } .tag-pill { cursor: pointer; }`}</style>

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
                    <span
                      className={`nav-link${activeTab === "feed" ? " active" : ""}`}
                      onClick={() => handleTabClick("feed")}
                    >
                      Your Feed
                    </span>
                  </li>
                )}
                <li className="nav-item">
                  <span
                    className={`nav-link${activeTab === "all" ? " active" : ""}`}
                    onClick={() => handleTabClick("all")}
                  >
                    Global Feed
                  </span>
                </li>
                {activeTab === "tag" && selectedTag && (
                  <li className="nav-item">
                    <span className="nav-link active">
                      <i className="ion-pound"></i> {selectedTag}
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <ArticleList config={listConfig} limit={10} />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag-pill tag-default"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
