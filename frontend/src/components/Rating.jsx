import { useEffect, useState } from "react";
import api from "../services/api";

function Rating({ dramaId }) {
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentUserId = () => {
    const token = localStorage.getItem("access_token");

    if (!token) return null;

    try {
      const payload = JSON.parse(
        atob(
          token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

      return String(payload.sub);
    } catch (error) {
      console.error("Failed to read user ID:", error);
      return null;
    }
  };

  const loadRatings = async () => {
    if (!dramaId) return;

    try {
      const response = await api.get(`/ratings/${dramaId}`);

      const loadedRatings = response.data;

      setRatings(loadedRatings);

      const currentUserId = getCurrentUserId();

      if (currentUserId) {
        const mine = loadedRatings.find(
          (rating) =>
            String(rating.user_id) ===
            String(currentUserId)
        );

        if (mine) {
          setMyRating(mine);
          setSelectedRating(Number(mine.score));
        } else {
          setMyRating(null);
          setSelectedRating(null);
        }
      } else {
        setMyRating(null);
        setSelectedRating(null);
      }
    } catch (error) {
      console.error("Failed to load ratings:", error);
    }
  };

  useEffect(() => {
    loadRatings();
  }, [dramaId]);

  const submitRating = async () => {
    if (selectedRating === null) {
      alert("Select a rating first.");
      return;
    }

    if (!localStorage.getItem("access_token")) {
      alert("Please log in to rate dramas.");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (myRating) {
        response = await api.patch(
          `/ratings/${dramaId}`,
          {
            score: selectedRating,
          }
        );
      } else {
        response = await api.post("/ratings", {
          drama_id: Number(dramaId),
          score: selectedRating,
        });
      }

      setMyRating(response.data);

      await loadRatings();

      alert("Rating saved!");
    } catch (error) {
      console.error("Failed to save rating:", error);

      if (error.response?.status === 409) {
        alert("You have already rated this drama.");
        await loadRatings();
      } else {
        alert(
          error.response?.data?.detail ||
            "Failed to save rating."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async () => {
    if (!myRating) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your rating?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/ratings/${dramaId}`);

      setMyRating(null);
      setSelectedRating(null);

      await loadRatings();
    } catch (error) {
      console.error("Failed to delete rating:", error);

      alert(
        error.response?.data?.detail ||
          "Failed to delete rating."
      );
    }
  };

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce(
            (sum, rating) =>
              sum + Number(rating.score),
            0
          ) / ratings.length
        ).toFixed(1)
      : "N/A";

  return (
    <section className="mt-12">

      {/* HEADER */}

      <div className="mb-8">

        <p
          className="
            text-amber-500
            uppercase
            tracking-[0.3em]
            text-sm
            mb-2
          "
        >
          Community
        </p>

        <h2 className="text-3xl font-bold">
          Ratings
        </h2>

      </div>

      {/* AVERAGE */}

      <div className="flex items-center gap-4 mb-8">

        <span className="text-amber-400 text-4xl">
          ★
        </span>

        <span className="text-4xl font-bold">
          {averageRating}
        </span>

        <span className="text-zinc-500">
          {ratings.length}{" "}
          {ratings.length === 1
            ? "rating"
            : "ratings"}
        </span>

      </div>

      {/* RATING SELECTOR */}

      <div
        className="
          rounded-2xl
          border
          border-zinc-800
          bg-black/60
          p-5
          max-w-2xl
          backdrop-blur-sm
        "
      >

        <p className="text-zinc-400 mb-4">
          {myRating
            ? "Update your rating"
            : "Rate this drama"}
        </p>

        <div className="flex flex-wrap gap-2">

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
            (number) => (
              <button
                key={number}
                onClick={() =>
                  setSelectedRating(number)
                }
                className={`
                  w-11
                  h-11
                  rounded-lg
                  border
                  transition
                  cursor-pointer
                  font-semibold
                  ${
                    selectedRating === number
                      ? "bg-amber-500 text-black border-amber-500"
                      : "border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-400"
                  }
                `}
              >
                {number}
              </button>
            )
          )}

        </div>

        {/* BUTTONS */}

        <div className="flex gap-3 mt-5">

          <button
            onClick={submitRating}
            disabled={
              loading ||
              selectedRating === null
            }
            className="
              px-6
              py-3
              rounded-lg
              bg-amber-500
              text-black
              font-semibold
              hover:bg-amber-400
              transition
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Saving..."
              : myRating
              ? "Update Rating"
              : "Submit Rating"}
          </button>

          {myRating && (
            <button
              onClick={deleteRating}
              className="
                px-6
                py-3
                rounded-lg
                border
                border-red-500/60
                text-red-400
                hover:bg-red-500/10
                transition
                cursor-pointer
              "
            >
              Delete
            </button>
          )}

        </div>

        {/* MY RATING */}

        {myRating && (
          <p className="text-zinc-400 mt-4">
            Your rating:{" "}
            <span className="text-amber-400 font-semibold">
              {myRating.score}/10
            </span>
          </p>
        )}

      </div>

    </section>
  );
}

export default Rating;