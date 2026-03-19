import { Link, NavLink, useParams, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { FollowButton } from "../components/profile/FollowButton";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { profile, isLoading, error, setProfile } = useProfile(username);

  const isCurrentUser = currentUser?.username === profile?.username;

  useEffect(() => {
    if (error) {
      navigate("/");
    }
  }, [error, navigate]);

  if (isLoading || !profile) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" alt={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {!isCurrentUser && (
                <FollowButton profile={profile} onToggle={setProfile} />
              )}
              {isCurrentUser && (
                <Link
                  to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-gear-a" /> Edit Profile Settings
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
