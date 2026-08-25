import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const getUser = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await api.get("/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to get user:", error);

      localStorage.removeItem("access_token");
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-zinc-900
        bg-zinc-950/90
        backdrop-blur-xl
      "
    >
      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-6">

        {/* LOGO */}

        <Link
          to="/"
          className="
            group
            text-xl
            font-bold
            tracking-tight
            text-white
          "
        >
          Drama
          <span
            className="
              text-red-600
              transition
              group-hover:text-red-500
            "
          >
            lytics
          </span>
        </Link>

        {/* NAVIGATION */}

        <nav className="flex items-center gap-1">

          {/* SEARCH */}

          <Link
            to="/search"
            className={`
              rounded-lg
              px-4
              py-2
              text-sm
              transition
              ${
                isActive("/search")
                  ? "bg-red-600/10 text-red-400"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
              }
            `}
          >
            Search
          </Link>

          {user ? (
            <>

              {/* WATCHLIST */}

              <Link
                to="/watchlist"
                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  transition
                  ${
                    isActive("/watchlist")
                      ? "bg-red-600/10 text-red-400"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                Watchlist
              </Link>

              {/* DIVIDER */}

              <div className="mx-3 h-5 w-px bg-zinc-800" />

              {/* USER */}

              <div className="hidden items-center gap-2 sm:flex">

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-red-900/60
                    bg-red-950/40
                    text-xs
                    font-semibold
                    text-red-400
                  "
                >
                  {(user.username || user.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <span
                  className="
                    max-w-[150px]
                    truncate
                    text-sm
                    text-zinc-400
                  "
                  title={user.username || user.email}
                >
                  {user.username || user.email}
                </span>

              </div>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={logout}
                style={{ cursor: "pointer" }}
                className="
                  ml-1
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  text-zinc-500
                  transition
                  hover:bg-red-950/30
                  hover:text-red-400
                "
              >
                Logout
              </button>

            </>
          ) : (
            <>

              {/* LOGIN */}

              <Link
                to="/login"
                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  transition
                  ${
                    isActive("/login")
                      ? "bg-red-600/10 text-red-400"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                Login
              </Link>

              {/* SIGN UP */}

              <Link
                to="/signup"
                className="
                  ml-1
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:-translate-y-0.5
                  hover:bg-red-500
                  hover:shadow-lg
                  hover:shadow-red-950/40
                "
              >
                Sign Up
              </Link>

            </>
          )}

        </nav>

      </div>
    </header>
  );
}

export default Navbar;