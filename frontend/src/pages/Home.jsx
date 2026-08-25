import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [topDramas, setTopDramas] = useState([]);
  const [loadingDramas, setLoadingDramas] = useState(true);

  const topDramasToFind = [
    {
      title: "Queen of Tears",
      year: 2024,
    },
    {
      title: "Lovely Runner",
      year: 2024,
    },
    {
      title: "Crash Landing on You",
      year: 2019,
    },
    {
      title: "Moving",
      year: 2023,
    },
    {
      title: "Alchemy of Souls",
      year: 2022,
    },
    {
      title: "The Glory",
      year: 2022,
    },
  ];

  useEffect(() => {
    const loadTopDramas = async () => {
      try {
        const results = await Promise.all(
          topDramasToFind.map(async (dramaInfo) => {
            try {
              const response = await api.get("/dramas/search", {
                params: {
                  q: dramaInfo.title,
                },
              });

              const searchResults = response.data.results || [];

              const normalizeTitle = (value) =>
                String(value || "")
                  .toLowerCase()
                  .replace(/\s+/g, " ")
                  .trim();

              const wantedTitle = normalizeTitle(dramaInfo.title);

              const matchingDrama = searchResults.find((drama) => {
                const resultTitle = normalizeTitle(drama.title);

                const resultYear = Number(
                  drama.year || drama.release_year || 0,
                );

                return (
                  resultTitle === wantedTitle && resultYear === dramaInfo.year
                );
              });

              return matchingDrama || null;
            } catch (error) {
              console.error(`Failed to load ${dramaInfo.title}:`, error);

              return null;
            }
          }),
        );

        setTopDramas(results.filter((drama) => drama !== null));
      } catch (error) {
        console.error("Failed to load top dramas:", error);
      } finally {
        setLoadingDramas(false);
      }
    };

    loadTopDramas();
  }, []);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-zinc-950 text-white">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[calc(100vh-73px)] overflow-hidden">
        {/* =================================================
            TOP DRAMAS BACKGROUND
        ================================================= */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Base */}
          <div className="absolute inset-0 bg-zinc-950" />

          {/* Poster wall */}
          {!loadingDramas && topDramas.length > 0 && (
            <div
              className="
      absolute
      right-[-2%]
      top-[-8%]
      flex
      w-[58%]
      scale-[0.62]
      origin-top-right
      rotate-[-7deg]
      gap-4
      opacity-40
      blur-[0.5px]
    "
            >
              {/* Column 1 */}
              <div className="flex w-1/3 shrink-0 flex-col gap-4 pt-28">
                {topDramas.slice(0, 2).map((drama) => (
                  <div
                    key={`bg-1-${drama.slug}`}
                    className="
            relative
            aspect-[2/3]
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            shadow-2xl
          "
                  >
                    <img
                      src={drama.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex w-1/3 shrink-0 flex-col gap-4 pt-4">
                {topDramas.slice(2, 4).map((drama) => (
                  <div
                    key={`bg-2-${drama.slug}`}
                    className="
            relative
            aspect-[2/3]
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            shadow-2xl
          "
                  >
                    <img
                      src={drama.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                ))}
              </div>

              {/* Column 3 */}
              <div className="flex w-1/3 shrink-0 flex-col gap-4 pt-32">
                {topDramas.slice(4, 6).map((drama) => (
                  <div
                    key={`bg-3-${drama.slug}`}
                    className="
            relative
            aspect-[2/3]
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            shadow-2xl
          "
                  >
                    <img
                      src={drama.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cinematic red glow */}
          <div
            className="
              absolute
              right-[10%]
              top-[10%]
              h-[700px]
              w-[700px]
              rounded-full
              bg-red-600/20
              blur-[150px]
            "
          />

          {/* Dark left side so text stays readable */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-zinc-950
              via-zinc-950/95
              via-50%
              to-zinc-950/20
            "
          />

          {/* Top/bottom fade */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-zinc-950/90
              via-transparent
              to-zinc-950
            "
          />

          {/* Extra red atmosphere */}
          <div
            className="
              absolute
              right-[15%]
              top-[40%]
              h-[350px]
              w-[550px]
              rotate-[-20deg]
              bg-red-600/10
              blur-[110px]
            "
          />
        </div>

        {/* =================================================
            HERO CONTENT
        ================================================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[calc(100vh-73px)]
            max-w-7xl
            items-center
            px-6
            py-20
          "
        >
          <div className="max-w-4xl">
            <p
              className="
                mb-6
                text-sm
                font-medium
                uppercase
                tracking-[0.35em]
                text-red-500
              "
            >
              Your drama companion
            </p>

            <h1
              className="
                text-6xl
                font-bold
                leading-[1.05]
                tracking-[-0.04em]
                text-white
                sm:text-7xl
                lg:text-8xl
              "
            >
              Find your next
              <span className="block text-zinc-500">obsession.</span>
            </h1>

            <p
              className="
                mt-8
                max-w-2xl
                text-lg
                leading-8
                text-zinc-400
              "
            >
              Discover dramas, track what you're watching, rate your favorites,
              and keep everything in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/search"
                className="
                  rounded-xl
                  bg-red-600
                  px-7
                  py-4
                  text-sm
                  font-semibold
                  text-white
                  shadow-xl
                  shadow-red-950/30
                  transition
                  hover:-translate-y-1
                  hover:bg-red-500
                "
              >
                Explore dramas
              </Link>

              <Link
                to="/watchlist"
                className="
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900/40
                  px-7
                  py-4
                  text-sm
                  font-semibold
                  text-white
                  backdrop-blur-md
                  transition
                  hover:-translate-y-1
                  hover:border-zinc-600
                  hover:bg-zinc-900
                "
              >
                My watchlist
              </Link>
            </div>

            {/* Stats */}

            <div
              className="
                mt-20
                flex
                flex-wrap
                gap-12
                border-t
                border-zinc-900
                pt-8
              "
            >
              <div>
                <p className="text-2xl font-semibold text-white">10k+</p>

                <p className="mt-1 text-sm text-zinc-600">Dramas to discover</p>
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">Ratings</p>

                <p className="mt-1 text-sm text-zinc-600">Share your opinion</p>
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">Watchlist</p>

                <p className="mt-1 text-sm text-zinc-600">
                  Never lose your next watch
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TOP DRAMAS — UNCHANGED
      ====================================================== */}

      <section
        className="
          border-t
          border-zinc-900
          bg-zinc-950
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            py-24
          "
        >
          <div className="flex items-end justify-between">
            <div>
              <p
                className="
                  text-sm
                  uppercase
                  tracking-[0.3em]
                  text-red-500
                "
              >
                Popular picks
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Top Dramas
              </h2>

              <p className="mt-3 max-w-xl text-zinc-500">
                Some of the most loved Korean dramas worth adding to your
                watchlist.
              </p>
            </div>

            <Link
              to="/search"
              className="
                hidden
                text-sm
                text-zinc-500
                transition
                hover:text-white
                sm:block
              "
            >
              Explore all →
            </Link>
          </div>

          {loadingDramas && (
            <div
              className="
                mt-12
                grid
                grid-cols-2
                gap-5
                sm:grid-cols-3
                lg:grid-cols-6
              "
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    aspect-[2/3]
                    animate-pulse
                    rounded-2xl
                    bg-zinc-900
                  "
                />
              ))}
            </div>
          )}

          {!loadingDramas && topDramas.length > 0 && (
            <div
              className="
                mt-12
                grid
                grid-cols-2
                gap-5
                sm:grid-cols-3
                lg:grid-cols-6
              "
            >
              {topDramas.map((drama, index) => (
                <Link
                  key={drama.slug || `${drama.title}-${index}`}
                  to={`/drama/${drama.slug}`}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900/30
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:border-zinc-600
                    hover:bg-zinc-900/70
                    hover:shadow-2xl
                    hover:shadow-black/50
                  "
                >
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

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/10
                        to-transparent
                        opacity-60
                        transition
                        duration-500
                        group-hover:opacity-100
                      "
                    />

                    <div
                      className="
                        absolute
                        left-3
                        top-3
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-black/75
                        text-sm
                        font-bold
                        text-white
                        backdrop-blur-md
                      "
                    >
                      {index + 1}
                    </div>

                    {drama.rating && (
                      <div
                        className="
                          absolute
                          bottom-3
                          left-3
                          rounded-lg
                          bg-black/75
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          text-white
                          backdrop-blur-md
                        "
                      >
                        ★ {drama.rating}
                      </div>
                    )}
                  </div>

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
                        group-hover:text-zinc-300
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
                        {drama.year || drama.release_year || "Unknown"}
                      </span>

                      {drama.rating && (
                        <span className="text-zinc-400">★ {drama.rating}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loadingDramas && topDramas.length === 0 && (
            <div
              className="
                  mt-12
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900/30
                  p-10
                  text-center
                "
            >
              <p className="text-zinc-500">Top dramas couldn't be loaded.</p>

              <Link
                to="/search"
                className="
                    mt-4
                    inline-block
                    text-sm
                    text-red-400
                    hover:text-red-300
                  "
              >
                Search dramas →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="border-t border-zinc-900">
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            py-24
          "
        >
          <div className="max-w-xl">
            <p
              className="
                text-sm
                uppercase
                tracking-[0.25em]
                text-zinc-600
              "
            >
              Everything in one place
            </p>

            <h2
              className="
                mt-3
                text-4xl
                font-bold
                tracking-tight
                text-white
              "
            >
              Built for people who take dramas seriously.
            </h2>
          </div>

          <div
            className="
              mt-14
              grid
              gap-5
              md:grid-cols-3
            "
          >
            <div
              className="
                group
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900/30
                p-7
                transition
                duration-500
                hover:-translate-y-2
                hover:border-zinc-600
                hover:bg-zinc-900/60
              "
            >
              <div
                className="
                  mb-10
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-950
                  text-lg
                "
              >
                ✦
              </div>

              <h3 className="text-xl font-semibold text-white">Discover</h3>

              <p className="mt-3 leading-7 text-zinc-500">
                Search through Korean dramas and find something worth watching
                tonight.
              </p>

              <Link
                to="/search"
                className="
                  mt-6
                  inline-block
                  text-sm
                  font-medium
                  text-zinc-300
                  transition
                  hover:text-white
                "
              >
                Start exploring →
              </Link>
            </div>

            <div
              className="
                group
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900/30
                p-7
                transition
                duration-500
                hover:-translate-y-2
                hover:border-zinc-600
                hover:bg-zinc-900/60
              "
            >
              <div
                className="
                  mb-10
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-950
                  text-lg
                "
              >
                ♡
              </div>

              <h3 className="text-xl font-semibold text-white">Track</h3>

              <p className="mt-3 leading-7 text-zinc-500">
                Keep the dramas you want to watch close and update their status
                whenever you want.
              </p>

              <Link
                to="/watchlist"
                className="
                  mt-6
                  inline-block
                  text-sm
                  font-medium
                  text-zinc-300
                  transition
                  hover:text-white
                "
              >
                Open watchlist →
              </Link>
            </div>

            <div
              className="
                group
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900/30
                p-7
                transition
                duration-500
                hover:-translate-y-2
                hover:border-zinc-600
                hover:bg-zinc-900/60
              "
            >
              <div
                className="
                  mb-10
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-950
                  text-lg
                "
              >
                ★
              </div>

              <h3 className="text-xl font-semibold text-white">Rate</h3>

              <p className="mt-3 leading-7 text-zinc-500">
                Give dramas your personal score and see what other viewers
                think.
              </p>

              <Link
                to="/search"
                className="
                  mt-6
                  inline-block
                  text-sm
                  font-medium
                  text-zinc-300
                  transition
                  hover:text-white
                "
              >
                Find a drama →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="border-t border-zinc-900">
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            py-24
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-900/40
              px-8
              py-16
              text-center
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-0
                h-64
                w-96
                -translate-x-1/2
                rounded-full
                bg-red-950/20
                blur-3xl
              "
            />

            <div className="relative">
              <p
                className="
                  text-sm
                  uppercase
                  tracking-[0.25em]
                  text-red-500
                "
              >
                Ready?
              </p>

              <h2
                className="
                  mt-4
                  text-4xl
                  font-bold
                  tracking-tight
                  text-white
                  sm:text-5xl
                "
              >
                Your next drama is waiting.
              </h2>

              <Link
                to="/search"
                className="
                  mt-8
                  inline-block
                  rounded-xl
                  bg-red-600
                  px-7
                  py-4
                  text-sm
                  font-semibold
                  text-white
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-red-500
                "
              >
                Find something to watch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
