import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ListErrors } from "../components/shared/ListErrors";
import type { Errors, User } from "../types";

function SettingsForm({
  currentUser,
  onUpdate,
  onLogout,
}: {
  currentUser: User;
  onUpdate: (user: Partial<User>) => Promise<User>;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  const [image, setImage] = useState(currentUser.image ?? "");
  const [username, setUsername] = useState(currentUser.username ?? "");
  const [bio, setBio] = useState(currentUser.bio ?? "");
  const [email, setEmail] = useState(currentUser.email ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      const updatedUser = await onUpdate({
        image,
        username,
        bio,
        email,
        ...(password ? { password } : {}),
      });
      navigate(`/profile/${updatedUser.username}`);
    } catch (err: unknown) {
      setErrors(err as Errors);
      setIsSubmitting(false);
    }
  }

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

            <button
              className="btn btn-outline-danger"
              onClick={onLogout}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser, updateUser, logout } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <SettingsForm
      key={currentUser.username}
      currentUser={currentUser}
      onUpdate={updateUser}
      onLogout={logout}
    />
  );
}
