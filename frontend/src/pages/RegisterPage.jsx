import { Link } from "react-router";

function RegisterPage() {
  return (
    <main>
      <h1>Register</h1>
      <p>Create your DailyFlow account.</p>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default RegisterPage;