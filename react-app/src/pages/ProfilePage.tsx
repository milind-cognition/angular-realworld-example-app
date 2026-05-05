import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  NavLink,
  useLocation,
  Link,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfilesApi } from "../api/profiles";
import { ArticleList } from "../components/articles/ArticleList";
import { FollowButton } from "../components/articles/FollowButton";
import type { Profile, ArticleListConfig } from "../types";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!username) return;

    ProfilesApi.get(username)
      .then(setProfile)
      .catch(() => {
        navigate("/");
      });
  }, [username, navigate]);

  if (!profile) return null;

  const isUser = currentUser?.username === profile.username;
  const isFavorites = location.pathname.endsWith("/favorites");

  const config: ArticleListConfig = isFavorites
    ? { type: "all", filters: { favorited: profile.username } }
    : { type: "all", filters: { author: profile.username } };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {!isUser && (
                <FollowButton
                  profile={profile}
                  onToggle={(updated) => setProfile(updated)}
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
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link${isActive ? " active" : ""}`
                    }
                    to={`/profile/${profile.username}`}
                    end
                  >
                    My Posts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link${isActive ? " active" : ""}`
                    }
                    to={`/profile/${profile.username}/favorites`}
                  >
                    Favorited Posts
                  </NavLink>
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
