import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#rooms", label: "Rooms" },
  { href: "#gallery", label: "Gallery" },
  { href: "#amenities", label: "Amenities" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-card"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick("#home")}
              className="flex items-center gap-3"
            >
              {/* Logo Image */}
              <div
                className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-colors ${
                  scrolled ? "bg-white" : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                <img
                  src="/el.jpg"
                  alt="El Gregorio Farm Resort Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Brand Name */}
              <div className="flex flex-col">
                <span
                  className={`font-heading text-sm font-semibold leading-tight ${
                    scrolled ? "text-gray-900" : "text-green-500"
                  }`}
                >
                  El Gregorio
                </span>
                <span
                  className={`font-body text-xs ${
                    scrolled ? "text-gray-500" : "text-yellow-500"
                  }`}
                >
                  Farm Resort
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`font-body text-sm font-medium transition-colors hover:text-accent ${
                    scrolled ? "text-gray-700" : "text-white/90"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick("#contact")}
                className="hidden md:block bg-accent text-white px-5 py-2.5 rounded-xl 
                           font-body text-sm font-medium hover:bg-accent-500 
                           transition-all duration-200 shadow-sm"
              >
                Reserve Now
              </button>

              <button
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white shadow-xl rounded-b-2xl mx-4"
          >
            <div className="py-4 px-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-3 rounded-xl font-body text-sm 
                             font-medium text-gray-700 hover:bg-gray-50 hover:text-primary
                             transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-2 mt-2 border-t border-gray-100">
                <button
                  onClick={() => handleNavClick("#contact")}
                  className="w-full bg-accent text-white px-4 py-3 rounded-xl 
                             font-body text-sm font-medium hover:bg-accent-500 
                             transition-colors text-center"
                >
                  Reserve Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
