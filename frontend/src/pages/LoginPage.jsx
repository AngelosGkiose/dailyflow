import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import {
  useAuth,
} from "../context/AuthContext.jsx";

import "../styles/auth.css";


function LoginPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    login,
  } = useAuth();


  const registrationSuccessful =
    location.state
      ?.registrationSuccessful ===
    true;


  const [
    formData,
    setFormData,
  ] = useState({
    email: "",
    password: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (
        currentFormData
      ) => ({
        ...currentFormData,
        [name]: value,
      })
    );
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");


    try {
      await login({
        email:
          formData.email.trim(),

        password:
          formData.password,
      });


      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (
      requestError
    ) {
      setError(
        requestError instanceof
        Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="auth-page">

      <section className="auth-brand-panel">
        <div className="auth-brand-header">
          <div className="auth-logo">
            D
          </div>

          <div>
            <h2 className="auth-brand-name">
              DailyFlow
            </h2>

            <p className="auth-brand-caption">
              Task manager
            </p>
          </div>
        </div>


        <div className="auth-brand-content">
          <h2>
            Organize your day.
            <br />
            Focus on what matters.
          </h2>

          <p>
            Keep your tasks,
            projects and priorities
            together in one clean,
            focused workspace.
          </p>

          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                ✓
              </span>

              Plan your daily tasks
            </div>

            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                #
              </span>

              Organize with projects
              and labels
            </div>

            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                ↑
              </span>

              Stay focused on your
              priorities
            </div>
          </div>
        </div>


        <p className="auth-brand-footer">
          DailyFlow productivity
          workspace
        </p>
      </section>


      <section className="auth-form-panel">
        <div className="auth-form-container">

          <header className="auth-form-header">
            <h1>
              Welcome back
            </h1>

            <p>
              Sign in to continue
              organizing your day.
            </p>
          </header>


          {registrationSuccessful && (
            <div className="auth-message auth-message-success">
              Account created successfully.
              You can now sign in.
            </div>
          )}


          <form
            className="auth-form"
            onSubmit={
              handleSubmit
            }
          >
            <div className="auth-field">
              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="name@example.com"
                autoComplete="email"
                disabled={
                  loading
                }
                required
              />
            </div>


            <div className="auth-field">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                name="password"
                type="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                minLength={8}
                maxLength={128}
                disabled={
                  loading
                }
                required
              />
            </div>


            {error && (
              <div
                className="auth-message auth-message-error"
                role="alert"
              >
                {error}
              </div>
            )}


            <button
              type="submit"
              className="auth-submit"
              disabled={
                loading
              }
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>


          <p className="auth-switch">
            Don&apos;t have an
            account?{" "}

            <Link to="/register">
              Create account
            </Link>
          </p>

        </div>
      </section>

    </main>
  );
}


export default LoginPage;