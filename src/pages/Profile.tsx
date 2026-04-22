import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { profileService } from "../services/profile";
import { FollowButton } from "../components/FollowButton";
import type { Profile as ProfileType } from "../types";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const isUser = user?.username === profile?.username;

  useEffect(() => {
    if (!username) return;
    profileService
      .get(username)
      .then(setProfile)
      .catch(() => navigate("/"));
  }, [username, navigate]);

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
                  onToggle={(p) => setProfile(p)}
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
                    className="nav-link"
                    to={`/profile/${profile.username}`}
                    end
                  >
                    My Posts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={`/profile/${profile.username}/favorites`}
                  >
                    Favorited Posts
                  </NavLink>
                </li>
              </ul>
            </div>

            <Outlet context={{ username: profile.username }} />
          </div>
        </div>
      </div>
    </div>
  );
}
