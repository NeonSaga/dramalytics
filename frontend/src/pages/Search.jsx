import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Country filter
  const [countryFilter, setCountryFilter] = useState("all");

  // =====================================================
  // GET COUNTRY FROM API RESULT
  // =====================================================

  const getCountry = (drama) => {
    const country =
      drama.country ||
      drama.countries ||
      drama.country_name ||
      drama.origin_country ||
      drama.nation ||
      "";

    if (Array.isArray(country)) {
      return country.join(" ").toLowerCase();
    }

    return String(country).toLowerCase();
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const searchDramas = async (searchQuery = query) => {
    const cleanQuery = searchQuery.trim();

    if (!cleanQuery) {
      setResults([]);
      return;
    }

    setLoading(true);

    setSearchParams({ q: cleanQuery });

    try {
      const response = await api.get("/dramas/search", {
        params: {
          q: cleanQuery,
        },
      });

      setResults(response.data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD SEARCH FROM URL
  // =====================================================

  useEffect(() => {
    const savedQuery = searchParams.get("q");

    if (savedQuery) {
      setQuery(savedQuery);
      searchDramas(savedQuery);
    }
  }, []);

  // =====================================================
  // COUNTRY FILTER
  // =====================================================

  const filteredResults = results.filter((drama) => {
    if (countryFilter === "all") {
      return true;
    }

    const country = getCountry(drama);

    return country.includes(countryFilter);
  });

  return (
    <main className="min-h-[calc(100vh-73px)] bg-zinc-950 text-white">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* =================================================
            HERO
        ================================================== */}

        <div className="max-w-3xl">

          <p className="text-sm uppercase tracking-[0.3em] text-red-500">
            Discover
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Find something to watch.
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-zinc-500">
            Search dramas from Korea and across Asia and discover
            your next obsession.
          </p>

        </div>

        {/* =================================================
            SEARCH BAR
        ================================================== */}

        <div className="mt-10 flex max-w-4xl gap-3">

          <div className="relative flex-1">

            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchDramas();
                }
              }}
              placeholder="Search dramas..."
              className="
                w-full
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900/70
                px-5
                py-4
                text-white
                shadow-xl
                shadow-black/20
                outline-none
                transition
                duration-300
                placeholder:text-zinc-600
                focus:border-red-600/70
                focus:bg-zinc-900
                focus:ring-1
                focus:ring-red-600/30
              "
            />

          </div>

          <button
            type="button"
            onClick={() => searchDramas()}
            disabled={loading}
            style={{ cursor: "pointer" }}
            className="
              rounded-xl
              bg-red-600
              px-7
              py-4
              text-sm
              font-semibold
              text-white
              transition
              duration-300
              hover:-translate-y-0.5
              hover:bg-red-500
              hover:shadow-lg
              hover:shadow-red-950/40
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="mt-16 flex items-center gap-3 text-zinc-500">

            <div
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-zinc-700
                border-t-red-500
              "
            />

            Searching dramas...

          </div>
        )}

        {/* =================================================
            RESULTS
        ================================================== */}

        {!loading && results.length > 0 && (
          <section className="mt-14">

            {/* Header */}

            <div className="mb-7 flex flex-wrap items-end justify-between gap-5">

              <div>

                <p className="text-sm text-zinc-600">
                  Search results for
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  "{query}"
                </h2>

              </div>

              {/* Country Filter */}

              <div className="flex items-center gap-3">

                <span className="text-sm text-zinc-600">
                  Country:
                </span>

                <select
                  value={countryFilter}
                  onChange={(event) =>
                    setCountryFilter(event.target.value)
                  }
                  style={{ cursor: "pointer" }}
                  className="
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-900
                    px-4
                    py-2
                    text-sm
                    text-zinc-300
                    outline-none
                    transition
                    hover:border-zinc-600
                    focus:border-red-600
                  "
                >

                  <option value="all">
                    All Countries
                  </option>

                  <option value="korea">
                    🇰🇷 South Korea
                  </option>

                  <option value="china">
                    🇨🇳 China
                  </option>

                  <option value="japan">
                    🇯🇵 Japan
                  </option>

                  <option value="taiwan">
                    🇹🇼 Taiwan
                  </option>

                  <option value="thailand">
                    🇹🇭 Thailand
                  </option>

                  <option value="philippines">
                    🇵🇭 Philippines
                  </option>

                  <option value="india">
                    🇮🇳 India
                  </option>

                </select>

                <span className="text-sm text-zinc-600">
                  {filteredResults.length}{" "}
                  {filteredResults.length === 1
                    ? "result"
                    : "results"}
                </span>

              </div>

            </div>

            {/* =================================================
                POSTER GRID
            ================================================== */}

            {filteredResults.length > 0 ? (

              <div
                className="
                  grid
                  grid-cols-2
                  gap-5
                  sm:grid-cols-3
                  md:grid-cols-4
                  lg:grid-cols-5
                "
              >

                {filteredResults.map((drama) => (

                  <Link
                    key={drama.slug}
                    to={`/drama/${drama.slug}`}
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-zinc-800/80
                      bg-zinc-900/30
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      hover:border-red-900/60
                      hover:bg-zinc-900/70
                      hover:shadow-2xl
                      hover:shadow-black/50
                    "
                  >

                    {/* POSTER */}

                    <div
                      className="
                        relative
                        aspect-[2/3]
                        overflow-hidden
                        bg-zinc-900
                      "
                    >

                      {drama.image ? (

                        <img
                          src={drama.image}
                          alt={drama.title}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-700
                            ease-out
                            group-hover:scale-110
                          "
                        />

                      ) : (

                        <div
                          className="
                            flex
                            h-full
                            items-center
                            justify-center
                            text-sm
                            text-zinc-600
                          "
                        >
                          No poster
                        </div>

                      )}

                      {/* Overlay */}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/90
                          via-black/10
                          to-transparent
                          opacity-0
                          transition
                          duration-500
                          group-hover:opacity-100
                        "
                      />

                      {/* Rating */}

                      {drama.rating && (
                        <div
                          className="
                            absolute
                            bottom-3
                            left-3
                            translate-y-2
                            rounded-lg
                            border
                            border-white/10
                            bg-black/70
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-amber-400
                            opacity-0
                            backdrop-blur-md
                            transition
                            duration-500
                            group-hover:translate-y-0
                            group-hover:opacity-100
                          "
                        >
                          ★ {drama.rating}
                        </div>
                      )}

                      {/* View */}

                      <span
                        className="
                          absolute
                          bottom-3
                          right-3
                          translate-y-2
                          rounded-lg
                          bg-red-600
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-white
                          opacity-0
                          transition
                          duration-500
                          group-hover:translate-y-0
                          group-hover:opacity-100
                        "
                      >
                        View
                      </span>

                    </div>

                    {/* INFO */}

                    <div className="p-4">

                      <h3
                        className="
                          line-clamp-2
                          min-h-[48px]
                          font-semibold
                          leading-6
                          text-white
                          transition-colors
                          duration-300
                          group-hover:text-red-400
                        "
                      >
                        {drama.title}
                      </h3>

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          text-sm
                        "
                      >

                        <span className="text-zinc-600">
                          {drama.year ||
                            drama.release_year ||
                            "Unknown"}
                        </span>

                        {drama.rating && (
                          <span className="text-zinc-400">
                            ★ {drama.rating}
                          </span>
                        )}

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            ) : (

              <div
                className="
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900/30
                  px-6
                  py-16
                  text-center
                "
              >

                <div className="mb-4 text-4xl">
                  🌏
                </div>

                <h2 className="text-xl font-semibold">
                  No dramas from this country
                </h2>

                <p className="mt-2 text-zinc-500">
                  Try another country or select All Countries.
                </p>

              </div>

            )}

          </section>
        )}

        {/* =================================================
            NO SEARCH RESULTS
        ================================================== */}

        {!loading &&
          query &&
          results.length === 0 && (

            <div
              className="
                mt-20
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900/30
                px-6
                py-16
                text-center
              "
            >

              <div className="mb-4 text-4xl">
                🔎
              </div>

              <h2 className="text-xl font-semibold">
                Nothing found
              </h2>

              <p className="mt-2 text-zinc-500">
                Try searching for another drama.
              </p>

            </div>
          )}

      </div>

    </main>
  );
}

export default Search;