import { Link } from "react-router";

function LoginPage() {
  return (
    <main>
      <h1>Login</h1>
      <p>Sign in to DailyFlow.</p>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>

      <Link to="/dashboard">
        Open dashboard temporarily
      </Link>
    </main>
  );
}

export default LoginPage;