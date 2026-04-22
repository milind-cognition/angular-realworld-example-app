import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/user";
import { ListErrors } from "../components/ListErrors";
import type { Errors } from "../types";

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [image, setImage] = useState(user?.image ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedUser = await userService.update({
        image,
        username,
        bio,
        email,
        ...(password ? { password } : {}),
      });
      updateUser(updatedUser);
      navigate(`/profile/${updatedUser.username}`);
    } catch (err) {
      setErrors(err as Errors);
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={errors} />

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                >
                  Update Settings
                </button>
              </fieldset>
            </form>

            <hr />

            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
