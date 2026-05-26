import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Profiles } from "../api/agent";
import { ArticleList } from "../components/ArticleList";
import { FollowButton } from "../components/FollowButton";
import { useAuth } from "../context/AuthContext";
import type { ArticleListConfig, Profile as ProfileType } from "../types";

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [activeTab, setActiveTab] = useState<"author" | "favorites">("author");

  useEffect(() => {
    if (!username) return;
    setActiveTab("author");
    Profiles.get(username)
      .then(setProfile)
      .catch(() => navigate("/"));
  }, [username, navigate]);

  const isUser = user?.username === profile?.username;

  const config: ArticleListConfig = useMemo(() => {
    if (!profile) return { type: "all", filters: {} };
    if (activeTab === "favorites") {
      return { type: "all", filters: { favorited: profile.username } };
    }
    return { type: "all", filters: { author: profile.username } };
  }, [profile, activeTab]);

  const handleToggleFollowing = (updated: ProfileType) => {
    setProfile(updated);
  };

  if (!profile) return null;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={profile.image}
                className="user-img"
                alt={profile.username}
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {!isUser && (
                <FollowButton
                  profile={profile}
                  onToggle={handleToggleFollowing}
                />
              )}
              {isUser && (
                <Link
                  to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a
                    className={`nav-link${activeTab === "author" ? " active" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("author")}
                  >
                    My Posts
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link${activeTab === "favorites" ? " active" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("favorites")}
                  >
                    Favorited Posts
                  </a>
                </li>
              </ul>
            </div>

            <ArticleList limit={10} config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}
