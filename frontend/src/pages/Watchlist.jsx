import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const getWatchlist = async () => {
    try {
      const response = await api.get("/watchlist");
      setWatchlist(response.data);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWatchlist();
  }, []);

  const updateStatus = async (dramaId, status) => {
    try {
      const response = await api.patch(
        `/watchlist/${dramaId}`,
        {
          status,
        }
      );

      setWatchlist((current) =>
        current.map((drama) =>
          Number(drama.drama_id) === Number(dramaId)
            ? {
                ...drama,
                status: response.data.status,
              }
            : drama
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status.");
    }
  };

  const removeDrama = async (dramaId) => {
    const confirmed = window.confirm(
      "Remove this drama from your watchlist?"
    );

    if (!confirmed) return;

    setRemovingId(dramaId);

    try {
      await api.delete(`/watchlist/${dramaId}`);

      setWatchlist((current) =>
        current.filter(
          (drama) =>
            Number(drama.drama_id) !== Number(dramaId)
        )
      );
    } catch (error) {
      console.error("Failed to remove drama:", error);
      alert("Failed to remove drama.");
    } finally {
      setRemovingId(null);
    }
  };

  const filteredWatchlist =
    filter === "all"
      ? watchlist
      : watchlist.filter(
          (drama) =>
            drama.status?.toLowerCase() === filter
        );

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-zinc-950">
        <p className="text-zinc-500">
          Loading watchlist...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-zinc-950">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* HEADER */}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.2em] text-red-500">
              Your collection
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
              My Watchlist
            </h1>

            <p className="mt-3 text-zinc-500">
              {watchlist.length}{" "}
              {watchlist.length === 1
                ? "drama"
                : "dramas"}{" "}
              saved
            </p>

          </div>

          <Link
            to="/search"
            className="
              w-fit
              rounded-lg
              bg-red-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-500
            "
          >
            + Add drama
          </Link>

        </div>

        {/* FILTERS */}

        {watchlist.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">

            {[
              ["all", "All"],
              ["watching", "Watching"],
              ["completed", "Completed"],
              ["plan_to_watch", "Plan to Watch"],
              ["dropped", "Dropped"],
            ].map(([value, label]) => (

              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  cursor-pointer
                  ${
                    filter === value
                      ? "bg-white text-zinc-950"
                      : "border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white"
                  }
                `}
              >
                {label}

                {value !== "all" && (
                  <span className="ml-2 opacity-50">
                    {
                      watchlist.filter(
                        (drama) =>
                          drama.status?.toLowerCase() ===
                          value
                      ).length
                    }
                  </span>
                )}
              </button>

            ))}

          </div>
        )}

        {/* EMPTY */}

        {filteredWatchlist.length === 0 ? (

          <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">

            <div className="mb-5 text-5xl">
              🎬
            </div>

            <h2 className="text-xl font-semibold text-white">
              {watchlist.length === 0
                ? "Your watchlist is empty"
                : `No ${filter.replaceAll("_", " ")} dramas`}
            </h2>

            <p className="mt-2 text-zinc-500">
              {watchlist.length === 0
                ? "Find a drama and add it to your watchlist."
                : "Try another filter."}
            </p>

            {watchlist.length === 0 && (
              <Link
                to="/search"
                className="
                  mt-6
                  inline-block
                  rounded-lg
                  bg-red-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-500
                "
              >
                Explore dramas
              </Link>
            )}

          </div>

        ) : (

          /* DRAMA GRID */

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">

            {filteredWatchlist.map((drama) => (

              <article
                key={drama.id}
                className="
                  group
                  overflow-hidden
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900/30
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:border-zinc-600
                "
              >

                {/* POSTER */}

                <Link to={`/drama/${drama.slug}`}>

                  <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">

                    {drama.poster_url ? (

                      <img
                        src={drama.poster_url}
                        alt={drama.title}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-500
                          group-hover:scale-105
                        "
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-zinc-600">
                        No poster
                      </div>

                    )}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/70
                        via-transparent
                        to-transparent
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                    />

                  </div>

                </Link>

                {/* INFO */}

                <div className="p-4">

                  <Link to={`/drama/${drama.slug}`}>

                    <h2
                      className="
                        line-clamp-2
                        font-semibold
                        text-white
                        transition
                        hover:text-zinc-300
                      "
                    >
                      {drama.title}
                    </h2>

                  </Link>

                  <p className="mt-2 text-sm text-zinc-500">
                    {drama.release_year || "Unknown"}
                  </p>

                  {/* STATUS */}

                  <select
                    value={drama.status || "watching"}
                    onChange={(event) =>
                      updateStatus(
                        drama.drama_id,
                        event.target.value
                      )
                    }
                    style={{ cursor: "pointer" }}
                    className="
                      mt-4
                      w-full
                      rounded-lg
                      border
                      border-zinc-700
                      bg-zinc-950
                      px-3
                      py-2
                      text-sm
                      text-zinc-300
                      outline-none
                      transition
                      hover:border-zinc-500
                      focus:border-red-500
                    "
                  >
                    <option value="watching">
                      Watching
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="plan_to_watch">
                      Plan to Watch
                    </option>

                    <option value="dropped">
                      Dropped
                    </option>

                  </select>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      removeDrama(drama.drama_id)
                    }
                    disabled={
                      removingId === drama.drama_id
                    }
                    style={{ cursor: "pointer" }}
                    className="
                      mt-3
                      w-full
                      rounded-lg
                      border
                      border-zinc-800
                      px-3
                      py-2
                      text-sm
                      text-zinc-500
                      transition
                      hover:border-red-900/70
                      hover:bg-red-950/30
                      hover:text-red-400
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {removingId === drama.drama_id
                      ? "Removing..."
                      : "Remove"}
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default Watchlist;