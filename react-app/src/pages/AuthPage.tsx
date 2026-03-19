import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ListErrors } from "../components/shared/ListErrors";
import type { Errors } from "../types";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isLogin = location.pathname === "/login";
  const title = isLogin ? "Sign in" : "Sign up";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<Errors | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = isLogin
    ? email.length > 0 && password.length > 0
    : email.length > 0 && password.length > 0 && username.length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ username, email, password });
      }
      navigate("/");
    } catch (err: unknown) {
      setErrors(err as Errors);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">{title}</h1>
            <p className="text-xs-center">
              {isLogin ? (
                <Link to="/register">Need an account?</Link>
              ) : (
                <Link to="/login">Have an account?</Link>
              )}
            </p>
            <ListErrors errors={errors} />
            <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
                {!isLogin && (
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </fieldset>
                )}
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={!isFormValid}
                >
                  {title}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
