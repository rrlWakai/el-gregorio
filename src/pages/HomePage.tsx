import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import RoomsSection from "@/components/sections/RoomsSection";
import AmenitiesSection from "@/components/sections/AmenitiesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ReservationSection from "@/components/sections/ReservationSection";
import LocationSection from "@/components/sections/LocationSection";
import Footer from "@/components/sections/Footer";
import Gallery from "@/components/sections/Gallery";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <HeroSection />
      <RoomsSection />
      <AmenitiesSection />
      <Gallery />
      <ReviewsSection />
      <ReservationSection />
      <LocationSection />
      <Footer />
    </div>
  );
}
