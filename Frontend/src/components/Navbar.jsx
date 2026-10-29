import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, isLoggedIn, isArtist, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-4 bg-[#121212]/90 backdrop-blur-md border-b border-neutral-800/80 sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <span className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-black text-xl shadow-md">
            ♫
          </span>
          <span>Spotify</span>
        </Link>
      </div>

      {/* Navigation & User actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Navigation links */}
        <Link
          to="/"
          className="text-neutral-400 hover:text-white font-semibold text-sm transition-colors hidden md:inline-block"
        >
          Home
        </Link>

        {isArtist && (
          <Link
            to="/artist/dashboard"
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-[#1DB954] px-3 py-1.5 rounded-full border border-neutral-700 transition-colors"
          >
            Artist Dashboard
          </Link>
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">
                {user.fullName?.firstName
                  ? `${user.fullName.firstName} ${user.fullName.lastName || ""}`
                  : user.email}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#1DB954]">
                {user.role || "Listener"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-full border border-neutral-700 transition-all duration-200"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/register"
              className="text-neutral-400 hover:text-white font-semibold text-xs sm:text-sm px-3 py-1.5 transition-colors"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm px-5 py-2 rounded-full transition-all duration-200 shadow-md"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
