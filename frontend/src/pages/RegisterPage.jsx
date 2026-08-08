import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import {
  registerUser,
} from "../api/authApi.js";

import "../styles/auth.css";


function RegisterPage() {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] = useState({
    username: "",
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

    setError("");
    setLoading(true);


    try {
      await registerUser({
        username:
          formData.username.trim(),

        email:
          formData.email.trim(),

        password:
          formData.password,
      });


      navigate(
        "/login",
        {
          replace: true,

          state: {
            registrationSuccessful:
              true,
          },
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
            Build a better
            <br />
            daily workflow.
          </h2>

          <p>
            Create one place for
            your tasks, projects,
            deadlines and priorities.
          </p>

          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                ✓
              </span>

              Capture everything
              you need to do
            </div>

            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                ◉
              </span>

              Focus on today
              and upcoming work
            </div>

            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                #
              </span>

              Organize tasks with
              projects and labels
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
              Create your account
            </h1>

            <p>
              Start organizing your
              tasks and daily
              responsibilities.
            </p>
          </header>


          <form
            className="auth-form"
            onSubmit={
              handleSubmit
            }
          >
            <div className="auth-field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your username"
                minLength={8}
                maxLength={30}
                autoComplete="username"
                disabled={
                  loading
                }
                required
              />
            </div>


            <div className="auth-field">
              <label htmlFor="register-email">
                Email
              </label>

              <input
                id="register-email"
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
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                name="password"
                type="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="At least 8 characters"
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
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
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>


          <p className="auth-switch">
            Already have an
            account?{" "}

            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>
      </section>

    </main>
  );
}


export default RegisterPage;