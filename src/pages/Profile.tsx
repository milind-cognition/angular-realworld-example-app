import { useState, useEffect } from "react";
import { useParams, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Profile as ProfileType } from "../types/profile";
import { ArticleListConfig } from "../types/article-list-config";
import { profilesService } from "../services/profiles";
import { useAuth } from "../context/AuthContext";
import { ArticleList } from "../components/ArticleList";

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<ProfileType | null>(null);

  const isFavorites = location.pathname.endsWith("/favorites");
  const isOwnProfile = currentUser?.username === username;

  const listConfig: ArticleListConfig = isFavorites
    ? { type: "all", filters: { favorited: username } }
    : { type: "all", filters: { author: username } };

  useEffect(() => {
    if (username) {
      profilesService.get(username).then(setProfile);
    }
  }, [username]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!profile) return;

    try {
      const updated = profile.following
        ? await profilesService.unfollow(profile.username)
        : await profilesService.follow(profile.username);
      setProfile(updated);
    } catch {
      // Error handled silently
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={profile.image || "https://api.realworld.io/images/smiley-cyrus.jpeg"}
                className="user-img"
                alt={profile.username}
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              {isOwnProfile ? (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onClick={() => navigate("/settings")}
                >
                  <i className="ion-gear-a"></i>&nbsp; Edit Profile Settings
                </button>
              ) : (
                <button
                  className={`btn btn-sm action-btn ${profile.following ? "btn-secondary" : "btn-outline-secondary"}`}
                  onClick={handleFollow}
                >
                  <i className="ion-plus-round"></i>&nbsp;
                  {profile.following ? "Unfollow" : "Follow"}{" "}
                  {profile.username}
                </button>
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
                    className="nav-link"
                    to={`/profile/${username}`}
                    end
                  >
                    My Articles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={`/profile/${username}/favorites`}
                  >
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>

            <ArticleList config={listConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
