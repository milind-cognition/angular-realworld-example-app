import { Outlet, useParams, NavLink } from "react-router-dom";

export default function Profile() {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <h4>{username}</h4>
              <p>Profile details will be implemented here.</p>
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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
