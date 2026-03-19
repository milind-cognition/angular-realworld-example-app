import { Link, useLocation } from "react-router-dom";

export default function Auth() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const pageTitle = isLogin ? "Sign in" : "Sign up";

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">{pageTitle}</h1>
            <p className="text-xs-center">
              {isLogin ? (
                <Link to="/register">Need an account?</Link>
              ) : (
                <Link to="/login">Have an account?</Link>
              )}
            </p>
            <p>Auth form will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
