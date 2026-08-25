import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-zinc-950 px-6">

      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-red-950/20
          blur-3xl
        "
      />

      <div className="relative text-center">

        <p
          className="
            text-8xl
            font-black
            tracking-tighter
            text-red-600
            sm:text-9xl
          "
        >
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
          This drama doesn't exist.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-zinc-500">
          Looks like you've wandered into a scene that was
          never filmed.
        </p>

        <div className="mt-8 flex justify-center gap-3">

          <Link
            to="/"
            className="
              rounded-xl
              bg-red-600
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:-translate-y-0.5
              hover:bg-red-500
            "
          >
            Go home
          </Link>

          <Link
            to="/search"
            className="
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900
              px-6
              py-3
              text-sm
              font-semibold
              text-zinc-300
              transition
              hover:border-zinc-600
              hover:text-white
            "
          >
            Search dramas
          </Link>

        </div>

      </div>

    </main>
  );
}

export default NotFound;