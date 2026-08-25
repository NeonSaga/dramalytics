import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async () => {
    if (
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Could not create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-zinc-950 px-6 py-16">

      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-200px]
          h-[500px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-red-950/30
          blur-3xl
        "
      />

      <div className="relative w-full max-w-md">

        {/* Header */}

        <div className="text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-red-500">
            Dramalytics
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Create an account
          </h1>

          <p className="mt-3 text-zinc-500">
            Join Dramalytics and start building your watchlist.
          </p>

        </div>

        {/* Card */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900/60
            p-6
            shadow-2xl
            shadow-black/30
            backdrop-blur-xl
          "
        >

          <div className="space-y-5">

            {/* Username */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Username
              </label>

              <input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-950
                  px-4
                  py-3
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-700
                  focus:border-red-600
                  focus:ring-1
                  focus:ring-red-600/30
                "
              />

            </div>

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-950
                  px-4
                  py-3
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-700
                  focus:border-red-600
                  focus:ring-1
                  focus:ring-red-600/30
                "
              />

            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-950
                    px-4
                    py-3
                    pr-20
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-red-600
                    focus:ring-1
                    focus:ring-red-600/30
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={{ cursor: "pointer" }}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-sm
                    text-zinc-600
                    transition
                    hover:text-red-400
                  "
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Confirm password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      signup();
                    }
                  }}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-950
                    px-4
                    py-3
                    pr-20
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-red-600
                    focus:ring-1
                    focus:ring-red-600/30
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  style={{ cursor: "pointer" }}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-sm
                    text-zinc-600
                    transition
                    hover:text-red-400
                  "
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* Signup */}

            <button
              type="button"
              onClick={signup}
              disabled={loading}
              style={{ cursor: "pointer" }}
              className="
                w-full
                rounded-xl
                bg-red-600
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:bg-red-500
                hover:shadow-lg
                hover:shadow-red-950/40
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </div>

        </div>

        {/* Login */}

        <p className="mt-6 text-center text-sm text-zinc-500">

          Already have an account?{" "}

          <Link
            to="/login"
            className="
              font-medium
              text-red-400
              transition
              hover:text-red-300
            "
          >
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Signup;