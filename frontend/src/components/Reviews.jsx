import { useEffect, useState } from "react";
import api from "../services/api";

function Reviews({ dramaId }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);

  // =====================================================
  // LOAD CURRENT USER
  // =====================================================

  const loadCurrentUser = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setCurrentUserId(null);
      return;
    }

    try {
      const response = await api.get("/me");

      console.log("Current user:", response.data);

      setCurrentUserId(
        response.data.id ?? response.data.user_id
      );

    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      setCurrentUserId(null);
    }
  };

  // =====================================================
  // LOAD REVIEWS
  // =====================================================

  const loadReviews = async () => {
    if (!dramaId) return;

    try {
      const response = await api.get(
        `/reviews/${dramaId}`
      );

      console.log("Reviews:", response.data);

      setReviews(response.data);

    } catch (error) {
      console.error(
        "Failed to load reviews:",
        error
      );
    }
  };

  // =====================================================
  // LOAD EVERYTHING
  // =====================================================

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!dramaId) return;

    loadReviews();
  }, [dramaId]);

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const submitReview = async () => {
    if (!text.trim()) {
      alert("Write something first.");
      return;
    }

    if (!localStorage.getItem("access_token")) {
      alert("Please log in to write a review.");
      return;
    }

    if (!dramaId) {
      alert("Drama is still loading. Try again.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/reviews", {
        drama_id: Number(dramaId),
        content: text.trim(),
      });

      setText("");

      await loadReviews();

    } catch (error) {
      console.error(
        "Failed to submit review:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to submit review."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const startEditing = (review) => {
    setEditingId(review.id);
    setEditText(review.content);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const updateReview = async (reviewId) => {
    if (!editText.trim()) {
      alert("Review cannot be empty.");
      return;
    }

    try {
      await api.patch(
        `/reviews/${reviewId}`,
        {
          content: editText.trim(),
        }
      );

      setEditingId(null);
      setEditText("");

      await loadReviews();

    } catch (error) {
      console.error(
        "Failed to update review:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to update review."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/reviews/${reviewId}`
      );

      await loadReviews();

    } catch (error) {
      console.error(
        "Failed to delete review:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to delete review."
      );
    }
  };

  // =====================================================
  // OWNERSHIP
  // =====================================================

  const isMyReview = (review) => {
    if (!currentUserId) {
      return false;
    }

    if (!review.user_id) {
      return false;
    }

    return (
      Number(review.user_id) ===
      Number(currentUserId)
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="max-w-5xl">

      {/* HEADER */}

      <div className="mb-8">

        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-red-500">
          Community
        </p>

        <h2 className="text-3xl font-bold text-white">
          Reviews
        </h2>

      </div>

      {/* WRITE REVIEW */}

      <div
        className="
          rounded-2xl
          border border-zinc-800
          bg-black/60
          p-5
          backdrop-blur-sm
        "
      >

        <textarea
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          placeholder="Share your thoughts about this drama..."
          rows={4}
          maxLength={2000}
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-zinc-800
            bg-zinc-950/80
            px-4
            py-4
            text-white
            outline-none
            placeholder:text-zinc-600
            focus:border-red-600
          "
        />

        <div className="mt-4 flex items-center justify-between">

          <span className="text-sm text-zinc-600">
            {text.length}/2000
          </span>

          <button
            type="button"
            onClick={submitReview}
            disabled={loading || !dramaId}
            className="
              rounded-lg
              bg-red-600
              px-6
              py-3
              font-semibold
              transition
              hover:bg-red-500
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Posting..."
              : "Post Review"}
          </button>

        </div>

      </div>

      {/* COUNT */}

      <div className="mb-5 mt-10">

        <span className="text-zinc-500">
          {reviews.length}{" "}
          {reviews.length === 1
            ? "review"
            : "reviews"}
        </span>

      </div>

      {/* EMPTY */}

      {reviews.length === 0 ? (

        <div
          className="
            rounded-xl
            border border-zinc-800
            bg-black/50
            p-8
            text-center
          "
        >

          <p className="text-zinc-500">
            No reviews yet.
          </p>

          <p className="mt-1 text-sm text-zinc-600">
            Be the first to share your thoughts.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {reviews.map((review) => {

            const mine = isMyReview(review);

            return (
              <article
                key={review.id}
                className="
                  rounded-xl
                  border border-zinc-800
                  bg-black/60
                  px-6
                  py-5
                  backdrop-blur-sm
                "
              >

                {/* USER */}

                <div className="mb-4 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-zinc-800
                        text-sm
                        font-semibold
                        text-zinc-300
                      "
                    >
                      {review.username
                        ? review.username
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>

                    <div>

                      <span className="font-semibold text-white">
                        {review.username || "User"}
                      </span>

                      {review.created_at && (
                        <p className="mt-1 text-xs text-zinc-600">
                          {new Date(
                            review.created_at
                          ).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* ONLY OWNER GETS THESE */}

                  {mine &&
                    editingId !== review.id && (

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            startEditing(review)
                          }
                          className="
                            rounded-md
                            border
                            border-zinc-700
                            px-3
                            py-1.5
                            text-sm
                            text-zinc-400
                            transition
                            hover:border-zinc-500
                            hover:text-white
                          "
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteReview(
                              review.id
                            )
                          }
                          className="
                            rounded-md
                            border
                            border-red-900
                            px-3
                            py-1.5
                            text-sm
                            text-red-500
                            transition
                            hover:bg-red-600/10
                          "
                        >
                          Delete
                        </button>

                      </div>

                    )}

                </div>

                {/* EDIT */}

                {editingId === review.id ? (

                  <div>

                    <textarea
                      value={editText}
                      onChange={(event) =>
                        setEditText(
                          event.target.value
                        )
                      }
                      rows={4}
                      maxLength={2000}
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-zinc-700
                        bg-zinc-950
                        px-4
                        py-3
                        text-white
                        outline-none
                        focus:border-red-600
                      "
                    />

                    <div className="mt-3 flex gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          updateReview(
                            review.id
                          )
                        }
                        className="
                          rounded-lg
                          bg-red-600
                          px-4
                          py-2
                          font-semibold
                          hover:bg-red-500
                        "
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="
                          rounded-lg
                          border
                          border-zinc-700
                          px-4
                          py-2
                          text-zinc-400
                          hover:text-white
                        "
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  <p
                    className="
                      whitespace-pre-wrap
                      leading-7
                      text-zinc-300
                    "
                  >
                    {review.content}
                  </p>

                )}

              </article>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default Reviews;