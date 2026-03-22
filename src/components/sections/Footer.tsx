import { Phone, MapPin } from "lucide-react";

const footerLinks = [
  { href: "#rooms", label: "Rooms" },
  { href: "#amenities", label: "Amenities" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <img
                  src="/el.jpg"
                  alt="El Gregorio Farm Resort Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-white leading-tight">
                  El Gregorio
                </p>
                <p className="font-body text-xs text-gray-400">Farm Resort</p>
              </div>
            </div>
            <p className="font-body text-gray-400 text-sm leading-relaxed max-w-xs">
              A peaceful farm resort perfect for families, groups, and couples
              looking for a refreshing nature escape.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-base text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="font-body text-sm text-gray-400 hover:text-white 
                               transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base text-white mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-gray-400">
                  0928-958-7391
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-gray-400">
                  Janopol Occidental, Tanauan City, Batangas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row 
                        items-center justify-between gap-4"
        >
          <p className="font-body text-sm text-gray-500">
            &copy; 2026 El Gregorio Farm Resort. All rights reserved.
          </p>
          <p className="font-body text-xs text-gray-600">
            Website developed by{" "}
            <span className="text-gray-400">Rhen-Rhen A. Lumbo</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
