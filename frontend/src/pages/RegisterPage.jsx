import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router";

import {
  registerUser,
} from "../api/authApi.js";

import "./RegisterPage.css";


function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  function handleChange(event) {
    const { name, value } =
      event.target;

    setFormData(
      (currentFormData) => ({
        ...currentFormData,
        [name]: value,
      })
    );
  }


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
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

      setSuccessMessage(
        "Account created successfully."
      );

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }, 1000);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-header">
          <div className="register-logo">
            D
          </div>

          <h1>Create your account</h1>

          <p>
            Start organizing your tasks,
            projects and daily
            responsibilities.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              minLength={8}
              maxLength={30}
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div
              className="form-message error-message"
              role="alert"
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div className="form-message success-message">
              {successMessage}
            </div>
          )}

          <button
            className="register-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}


export default RegisterPage;