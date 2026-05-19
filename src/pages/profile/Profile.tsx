import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useParams,
  useNavigate,
} from "react-router-dom";
import { Profiles } from "../../api/agent";
import { useAuth } from "../../context/AuthContext";
import { FollowButton } from "./FollowButton";
import type { Profile as ProfileType } from "../../types";

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    if (!username) return;
    Profiles.get(username)
      .then(({ profile }) => {
        setProfile(profile);
      })
      .catch(() => {
        navigate("/");
      });
  }, [username, navigate]);

  if (!profile) {
    return null;
  }

  const isOwnProfile = user?.username === profile.username;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" alt="" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-gear-a" /> Edit Profile Settings
                </Link>
              ) : (
                <FollowButton
                  profile={profile}
                  onToggle={(updated) => setProfile(updated)}
                />
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
                    to={`/profile/${profile.username}`}
                    end
                    className={({ isActive }) =>
                      `nav-link${isActive ? " active" : ""}`
                    }
                  >
                    My Posts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={`/profile/${profile.username}/favorites`}
                    className={({ isActive }) =>
                      `nav-link${isActive ? " active" : ""}`
                    }
                  >
                    Favorited Posts
                  </NavLink>
                </li>
              </ul>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
