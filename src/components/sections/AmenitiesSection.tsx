import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, Coffee, Square, Users } from "lucide-react";

const amenities = [
  {
    icon: Waves,
    title: "Swimming Pools",
    description:
      "Enjoy two refreshing pools: an Infinity Pool (4–5 ft deep) and a Kiddie Pool (2–3 ft deep) perfect for younger guests.",
  },
  {
    icon: Square,
    title: "Half Court",
    description:
      "Guests may enjoy playing at our half court area. Please note that the resort does not provide a ball.",
  },
  {
    icon: Users,
    title: "Pavilion",
    description:
      "A spacious pavilion capable of accommodating up to 100 guests, perfect for gatherings, celebrations, and special events.",
  },
  {
    icon: Coffee,
    title: "Gusto Café",
    description:
      "Our in-house café offers rice meals, snacks, coffee, and refreshing drinks. Open Tuesday–Friday (3 PM – 9 PM) and weekends (10 AM – 9 PM). Closed on Mondays.",
  },
];

const images = [
  "/images/pool.png",
  "/images/pavilion.jpg",
  "/images/court.png",
  "/images/cafe.jpg",
];

export default function AmenitiesSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section id="amenities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-accent/15 text-accent-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            What We Offer
          </span>

          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Resort Amenities
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto">
            Enjoy relaxing facilities designed to make your stay comfortable,
            memorable, and enjoyable.
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Amenities Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {amenities.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Animated Image Slider */}
          <div
            className="relative h-[420px] w-full overflow-hidden rounded-2xl shadow-xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={images[currentImage]}
                src={images[currentImage]}
                alt="Resort Amenity"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentImage === index ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
