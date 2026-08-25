import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!email.trim() || !password) {
      alert("Please enter your email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: email.trim(),
        password,
      });

      const token = response.data.access_token;

      localStorage.setItem("access_token", token);

      await api.get("/me");

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Invalid email or password");
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
            Welcome back
          </h1>

          <p className="mt-3 text-zinc-500">
            Log in to access your watchlist and ratings.
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
                  placeholder="Your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      login();
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

            {/* Login */}

            <button
              type="button"
              onClick={login}
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
              {loading ? "Logging in..." : "Login"}
            </button>

          </div>

        </div>

        {/* Signup */}

        <p className="mt-6 text-center text-sm text-zinc-500">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="
              font-medium
              text-red-400
              transition
              hover:text-red-300
            "
          >
            Create one
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Login;