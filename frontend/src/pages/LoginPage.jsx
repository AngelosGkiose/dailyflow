import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import {
  loginUser,
} from "../api/authApi.js";

import {
  useAuth,
} from "../context/AuthContext.jsx";


function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


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

    setLoading(true);
    setError("");

    try {
      const data = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!data?.access_token) {
        throw new Error(
          "The server did not return an access token"
        );
      }

      login(data.access_token);

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
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
    <main>
      <section>
        <div>
          <div>D</div>

          <h1>Welcome back</h1>

          <p>
            Sign in to manage your tasks,
            projects and daily responsibilities.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              minLength={8}
              maxLength={128}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        <p>
          Don&apos;t have an account?{" "}
          <Link to="/register">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}


export default LoginPage;