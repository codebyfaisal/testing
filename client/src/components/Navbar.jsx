import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import usePortfolioStore from "../store/usePortfolioStore";

const Navbar = () => {
  const { user, isRounded } = usePortfolioStore();
  const username = user?.username;
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b py-2",
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-white/10"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-0 md:max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-text-primary tracking-tighter"
            >
              {username || "Portfolio"}
              <span className="text-secondary">.</span>
            </Link>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors duration-200",
                    isRounded ? "rounded-md" : "",
                    location.pathname === link.path
                      ? "text-secondary bg-white/5"
                      : "text-neutral-300 hover:text-text-primary hover:bg-white/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
