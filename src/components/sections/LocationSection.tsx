import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

export default function LocationSection() {
  // ✅ Verified coordinates from Google Maps
  const latitude = 14.0812259;
  const longitude = 121.0879564;

  // ✅ Open in Maps (exact place)
  const mapsUrl = `https://www.google.com/maps?q=El+Gregorio+Farm+Resort&ll=${latitude},${longitude}`;

  // ✅ Embed using precise coordinates
  const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=18&output=embed`;

  return (
    <section id="location" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block bg-primary/10 text-primary px-4 py-1.5 
                           rounded-full font-body text-sm font-medium mb-4"
          >
            Find Us
          </span>

          <h2 className="section-title mb-4">Our Location</h2>

          <div className="flex items-center justify-center gap-2 text-gray-500 font-body text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>
              El Gregorio Farm Resort, Janopol Occidental, Tanauan City,
              Batangas
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden shadow-card-hover border border-gray-100"
        >
          <iframe
            src={embedUrl}
            width="100%"
            height="450"
            className="w-full h-[450px]"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="El Gregorio Farm Resort Location"
          />
        </motion.div>

        <div className="text-center mt-8 flex justify-center gap-4 flex-wrap">
          {/* Open Maps */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white 
                       px-6 py-3 rounded-xl font-body text-sm font-medium 
                       hover:bg-primary-600 transition-all duration-200 shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            Open in Google Maps
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>

          {/* 🚀 BONUS: Directions */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-primary text-primary 
                       px-6 py-3 rounded-xl font-body text-sm font-medium 
                       hover:bg-primary/10 transition-all duration-200"
          >
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
