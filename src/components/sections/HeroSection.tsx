import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, Waves, Users, ChevronDown } from "lucide-react";
import { useRef } from "react";

const badges = [
  { icon: Leaf, label: "Nature Experience" },
  { icon: Waves, label: "Private Pool" },
  { icon: Users, label: "Perfect for Families" },
];

export default function HeroSection() {
  const ref = useRef(null);

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToRooms = () => {
    const el = document.querySelector("#rooms");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 🎥 VIDEO BACKGROUND WITH PARALLAX */}
      <motion.video
        style={{ y: yBg }}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/resort-bg.mp4" type="video/mp4" />
      </motion.video>

      {/* 🌑 DARK GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      {/* ✨ GLOW EFFECT (cinematic touch) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 w-[600px] h-[600px] 
                        bg-accent/20 blur-[140px] rounded-full -translate-x-1/2"
        />
      </div>

      {/* 🌫️ GLASS BLUR LAYER */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* 🎯 CONTENT */}
      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <span
            className="inline-block bg-accent/20 backdrop-blur-md border border-accent/40 
                           text-accent px-4 py-1.5 rounded-full text-sm mb-6"
          >
            Welcome to El Gregorio Farm Resort
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6">
            Experience Nature
            <br />
            <span className="text-accent italic"> & Relaxation</span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Escape the city and enjoy peaceful moments in a cinematic paradise.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={scrollToContact}
              className="bg-accent text-white px-8 py-4 rounded-2xl font-semibold 
                         shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
            >
              Reserve Your Stay
            </button>

            <button
              onClick={scrollToRooms}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white 
                         px-8 py-4 rounded-2xl hover:bg-white/20 transition"
            >
              View Rooms
            </button>
          </div>

          {/* BADGES */}
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md 
                           border border-white/20 rounded-xl px-5 py-3"
              >
                <badge.icon className="w-5 h-5 text-accent" />
                <span className="text-white text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ⬇ SCROLL INDICATOR */}
      <motion.button
        onClick={scrollToRooms}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}
