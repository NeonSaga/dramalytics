import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Rating from "../components/Rating";
import Reviews from "../components/Reviews";

function DramaDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [drama, setDrama] = useState(null);
  const [loading, setLoading] = useState(true);

  const [savedDramaId, setSavedDramaId] = useState(null);

  const [watchlistStatus, setWatchlistStatus] = useState(null);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // =====================================================
  // LOAD DRAMA
  // =====================================================

  useEffect(() => {
  const loadDrama = async () => {
    try {
      const response = await api.get(
        `/dramas/${slug}`
      );

      const dramaData = response.data;

      setDrama(dramaData);

      // If backend already gave us our local DB ID
      if (dramaData?.id) {
        setSavedDramaId(dramaData.id);
        return;
      }

      // Otherwise make sure this drama exists
      // in our local database.
      try {
        const savedResponse = await api.post(
          `/dramas/${slug}/save`
        );

        setSavedDramaId(
          savedResponse.data.id
        );

      } catch (saveError) {
        console.error(
          "Failed to save drama locally:",
          saveError
        );
      }

    } catch (error) {
      console.error(
        "Failed to load drama:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (slug) {
    loadDrama();
  }
}, [slug]);

  // =====================================================
  // MAKE SURE DRAMA EXISTS IN OUR DATABASE
  // =====================================================

  const ensureDramaSaved = async () => {
    if (savedDramaId) {
      return savedDramaId;
    }

    if (!drama?.slug) {
      throw new Error("Drama slug is missing.");
    }

    try {
      const response = await api.post(
        `/dramas/${drama.slug}/save`
      );

      console.log(
        "Drama saved to local database:",
        response.data
      );

      const localDramaId = response.data.id;

      setSavedDramaId(localDramaId);

      return localDramaId;

    } catch (error) {
      console.error(
        "Failed to save drama to database:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // LOAD WATCHLIST STATUS
  // =====================================================

  useEffect(() => {
    const loadWatchlistStatus = async () => {
      const token = localStorage.getItem("access_token");

      if (!token || !savedDramaId) {
        return;
      }

      try {
        const response = await api.get("/watchlist");

        const item = response.data.find(
          (item) =>
            Number(item.drama_id) === Number(savedDramaId)
        );

        if (item) {
          setWatchlistStatus(
            String(item.status).toLowerCase()
          );
        } else {
          setWatchlistStatus(null);
        }

      } catch (error) {
        console.error(
          "Failed to load watchlist:",
          error
        );
      }
    };

    loadWatchlistStatus();
  }, [savedDramaId]);

  // =====================================================
  // ADD TO WATCHLIST
  // =====================================================

  const addToWatchlist = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert(
        "Please log in to add dramas to your watchlist."
      );
      return;
    }

    if (watchlistLoading) {
      return;
    }

    setWatchlistLoading(true);

    try {
      // IMPORTANT:
      // Get the ID from OUR database.
      const localDramaId =
        await ensureDramaSaved();

      const response = await api.post(
        "/watchlist",
        {
          drama_id: localDramaId,
          status: "watching",
        }
      );

      setWatchlistStatus(
        String(response.data.status).toLowerCase()
      );

    } catch (error) {
      console.error(
        "Failed to add drama:",
        error
      );

      if (error.response?.status === 409) {
        setWatchlistStatus("watching");
      } else if (error.response?.status === 401) {
        localStorage.removeItem("access_token");

        alert("Your login session expired. Please log in again.");
      } else {
        alert(
          error.response?.data?.detail ||
            "Failed to add drama."
        );
      }

    } finally {
      setWatchlistLoading(false);
    }
  };

  // =====================================================
  // CHANGE WATCHLIST STATUS
  // =====================================================

  const changeWatchlistStatus = async () => {
    if (!savedDramaId || watchlistLoading) {
      return;
    }

    const newStatus =
      watchlistStatus === "watching"
        ? "completed"
        : "watching";

    setWatchlistLoading(true);

    try {
      const response = await api.patch(
        `/watchlist/${savedDramaId}`,
        {
          status: newStatus,
        }
      );

      setWatchlistStatus(
        String(response.data.status).toLowerCase()
      );

    } catch (error) {
      console.error(
        "Failed to update watchlist:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to update watchlist."
      );

    } finally {
      setWatchlistLoading(false);
    }
  };

  // =====================================================
  // SCROLL TO RATINGS
  // =====================================================

  const scrollToRatings = () => {
    const ratingsSection =
      document.getElementById(
        "ratings-section"
      );

    if (ratingsSection) {
      ratingsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!drama) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Drama not found.
      </div>
    );
  }

  // =====================================================
  // POSTER
  // =====================================================

  const posterUrl =
    drama.poster_url ||
    drama.poster ||
    drama.posterUrl ||
    drama.image ||
    null;

  // =====================================================
  // COUNTRY
  // =====================================================

  const getCountryLabel = () => {
    const country =
      drama?.country ||
      drama?.countries ||
      drama?.country_name ||
      drama?.origin_country ||
      drama?.nation ||
      "";

    if (!country) {
      return "DRAMA";
    }

    const countryText = Array.isArray(country)
      ? country.join(" ")
      : String(country);

    const normalized =
      countryText.toLowerCase();

    if (
      normalized.includes("korea") ||
      normalized.includes("south korea")
    ) {
      return "KOREAN DRAMA";
    }

    if (
      normalized.includes("china") ||
      normalized.includes("chinese")
    ) {
      return "CHINESE DRAMA";
    }

    if (
      normalized.includes("japan") ||
      normalized.includes("japanese")
    ) {
      return "JAPANESE DRAMA";
    }

    if (
      normalized.includes("thailand") ||
      normalized.includes("thai")
    ) {
      return "THAI DRAMA";
    }

    if (
      normalized.includes("taiwan") ||
      normalized.includes("taiwanese")
    ) {
      return "TAIWANESE DRAMA";
    }

    if (
      normalized.includes("philippines") ||
      normalized.includes("filipino")
    ) {
      return "FILIPINO DRAMA";
    }

    if (
      normalized.includes("india") ||
      normalized.includes("indian")
    ) {
      return "INDIAN DRAMA";
    }

    if (
      normalized.includes("hong kong")
    ) {
      return "HONG KONG DRAMA";
    }

    if (
      normalized.includes("singapore")
    ) {
      return "SINGAPOREAN DRAMA";
    }

    return `${countryText.toUpperCase()} DRAMA`;
  };

  const countryLabel =
    getCountryLabel();

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* BACKGROUND */}

      {posterUrl && (
        <div
          className="
            fixed
            inset-0
            z-0
            overflow-hidden
            pointer-events-none
          "
        >
          <img
            src={posterUrl}
            alt=""
            className="
              absolute
              w-full
              h-full
              object-cover
              blur-[9px]
              opacity-80
            "
            style={{
              transform:
                "scale(1.0) translate(6%, 8%)",
              transformOrigin:
                "center center",
            }}
          />

          <div className="absolute inset-0 bg-black/25" />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/80
              via-black/35
              to-black/10
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/70
              via-transparent
              to-black/20
            "
          />
        </div>
      )}

      {!posterUrl && (
        <div className="fixed inset-0 z-0 bg-black" />
      )}

      {/* CONTENT */}

      <div className="relative z-10">

        {/* BACK */}

        <div className="max-w-7xl mx-auto px-8 pt-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              text-zinc-400
              hover:text-white
              transition
              cursor-pointer
            "
          >
            ← Back
          </button>

        </div>

        {/* HERO */}

        <main className="max-w-7xl mx-auto px-8 py-12">

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[380px_1fr]
              gap-14
            "
          >

            {/* POSTER */}

            <div className="flex justify-center lg:justify-start">

              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={drama.title}
                  className="
                    w-[320px]
                    lg:w-[380px]
                    max-h-[570px]
                    object-cover
                    rounded-2xl
                    shadow-2xl
                    ring-1
                    ring-white/10
                  "
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div
                  className="
                    w-[320px]
                    lg:w-[380px]
                    h-[570px]
                    rounded-2xl
                    bg-zinc-900
                    flex
                    items-center
                    justify-center
                    text-zinc-500
                  "
                >
                  Poster unavailable
                </div>
              )}

            </div>

            {/* INFO */}

            <div className="pt-2">

              <p
                className="
                  text-red-500
                  uppercase
                  tracking-[0.35em]
                  text-sm
                  font-medium
                  mb-4
                "
              >
                {countryLabel}
              </p>

              <h1
                className="
                  text-5xl
                  lg:text-7xl
                  font-bold
                  tracking-tight
                  leading-tight
                "
              >
                {drama.title}

                {drama.release_year &&
                  ` (${drama.release_year})`}
              </h1>

              {/* META */}

              <div
                className="
                  flex
                  flex-wrap
                  gap-6
                  mt-8
                  text-zinc-300
                "
              >
                {drama.episodes && (
                  <span>
                    {drama.episodes} episodes
                  </span>
                )}

                {drama.duration && (
                  <span>
                    {drama.duration}
                  </span>
                )}

                {drama.network && (
                  <span>
                    {drama.network}
                  </span>
                )}
              </div>

              {/* RATING */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mt-8
                "
              >
                <span className="text-amber-400 text-3xl">
                  ★
                </span>

                <span className="text-3xl font-bold">
                  {drama.rating ?? "N/A"}
                </span>

                {drama.rating_count && (
                  <span className="text-zinc-500">
                    (
                    {drama.rating_count.toLocaleString()}
                    users)
                  </span>
                )}
              </div>

              {/* GENRES */}

              {drama.genres &&
                drama.genres.length > 0 && (
                  <div
                    className="
                      flex
                      flex-wrap
                      gap-3
                      mt-8
                    "
                  >
                    {drama.genres.map(
                      (genre, index) => (
                        <span
                          key={index}
                          className="
                            px-5
                            py-2
                            rounded-full
                            border
                            border-red-500/50
                            bg-black/40
                            text-zinc-200
                          "
                        >
                          {genre}
                        </span>
                      )
                    )}
                  </div>
                )}

              {/* BUTTONS */}

              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                  mt-10
                "
              >

                {/* WATCHLIST */}

                {!watchlistStatus ? (

                  <button
                    type="button"
                    onClick={addToWatchlist}
                    disabled={watchlistLoading}
                    className="
                      px-7
                      py-4
                      rounded-xl
                      bg-red-600
                      hover:bg-red-500
                      active:scale-95
                      transition
                      font-semibold
                      shadow-lg
                      shadow-red-900/30
                      cursor-pointer
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    {watchlistLoading
                      ? "Adding..."
                      : "＋ Add to Watchlist"}
                  </button>

                ) : (

                  <button
                    type="button"
                    onClick={changeWatchlistStatus}
                    disabled={watchlistLoading}
                    className="
                      px-7
                      py-4
                      rounded-xl
                      bg-red-600
                      hover:bg-red-500
                      active:scale-95
                      transition
                      font-semibold
                      shadow-lg
                      shadow-red-900/30
                      cursor-pointer
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    {watchlistLoading
                      ? "Updating..."
                      : watchlistStatus === "watching"
                      ? "✓ Watching"
                      : "✓ Completed"}
                  </button>

                )}

                {/* RATE */}

                <button
                  type="button"
                  onClick={scrollToRatings}
                  className="
                    px-7
                    py-4
                    rounded-xl
                    border
                    border-amber-500/70
                    text-amber-400
                    hover:bg-amber-500/10
                    transition
                    font-semibold
                    cursor-pointer
                  "
                >
                  ☆ Rate
                </button>

              </div>

              {/* DIVIDER */}

              <div
                className="
                  h-px
                  bg-gradient-to-r
                  from-red-600/70
                  via-red-900/30
                  to-transparent
                  mt-14
                  mb-10
                "
              />

              {/* SYNOPSIS */}

              <section>

                <p
                  className="
                    text-red-500
                    uppercase
                    tracking-[0.3em]
                    text-sm
                    mb-5
                  "
                >
                  Synopsis
                </p>

                <p
                  className="
                    text-zinc-300
                    text-lg
                    leading-9
                    max-w-5xl
                  "
                >
                  {drama.synopsis ||
                    "No synopsis available."}
                </p>

              </section>

            </div>
          </div>

          {/* RATINGS */}

          <section
            id="ratings-section"
            className="mt-20 scroll-mt-24"
          >

            <div
              className="
                h-px
                bg-gradient-to-r
                from-red-600/60
                via-zinc-800
                to-transparent
                mb-10
              "
            />

            <Rating dramaId={savedDramaId} />

          </section>

          {/* REVIEWS */}

          <section className="mt-16 pb-20">

            <div
              className="
                h-px
                bg-gradient-to-r
                from-red-600/60
                via-zinc-800
                to-transparent
                mb-10
              "
            />

            <Reviews dramaId={savedDramaId} />

          </section>

        </main>

      </div>

    </div>
  );
}

export default DramaDetails;