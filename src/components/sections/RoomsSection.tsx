import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, Users, ArrowRight } from "lucide-react";
import { roomsService } from "@/services/rooms";
import type { Room } from "@/types";
import { formatPrice } from "@/utils/helpers";

const fallbackRooms: Room[] = [
  {
    id: "1",
    name: "Family Room",
    description:
      "Spacious and comfortable room perfect for families. Features air-conditioning and comfortable beds.",
    capacity_min: 6,
    capacity_max: 8,
    base_price: 4500,
    image_url:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    amenities: ["Air-conditioning", "Comfortable beds", "Private bathroom"],
    slug: "family-room",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "Couple Room",
    description:
      "An intimate retreat for couples featuring a private bathroom and stunning garden views.",
    capacity_min: 2,
    capacity_max: 3,
    base_price: 2500,
    image_url:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    amenities: ["Private bathroom", "Garden view", "Air-conditioning"],
    slug: "couple-room",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    name: "Group Villa",
    description:
      "Our largest accommodation perfect for group gatherings, team buildings, and celebrations.",
    capacity_min: 10,
    capacity_max: 15,
    base_price: 7500,
    image_url:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
    amenities: ["Kitchen area", "Pool access", "Air-conditioning"],
    slug: "group-villa",
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

function RoomCard({ room, index }: { room?: Room; index: number }) {
  if (!room) return null; // Prevent crash if room is undefined

  const amenities = room.amenities || [];
  const imageUrl =
    room.image_url ||
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80";
  const description = room.description || "No description available.";
  const minCapacity = room.capacity_min ?? 1;
  const maxCapacity = room.capacity_max ?? 1;
  const price = room.base_price ?? 0;

  const handleReserve = () => {
    const el = document.querySelector("#contact");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="card group hover:shadow-card-hover transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={room.name ?? "Room"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div
          className="absolute top-4 right-4 bg-accent text-white px-3 py-1.5 
                        rounded-lg font-body text-sm font-semibold shadow-lg"
        >
          {formatPrice(price)}
          <span className="text-xs font-normal opacity-90"> / night</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading text-xl text-gray-900 mb-2">
          {room.name ?? "Room"}
        </h3>
        <p className="font-body text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-body text-sm">
              {minCapacity}&ndash;{maxCapacity} guests
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <BedDouble className="w-4 h-4 text-primary" />
            <span className="font-body text-sm">Accommodation</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="bg-primary/8 text-primary px-3 py-1 rounded-full 
                         font-body text-xs font-medium"
            >
              {amenity}
            </span>
          ))}
        </div>

        <button
          onClick={handleReserve}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white 
                     py-3 rounded-xl font-body text-sm font-semibold hover:bg-primary-600 
                     active:bg-primary-700 transition-all duration-200 group/btn"
        >
          Reserve This Room
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

export default function RoomsSection() {
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);

  useEffect(() => {
    roomsService.getActiveRooms().then(({ data }) => {
      if (data && data.length > 0) {
        // Ensure every room has amenities array
        const sanitizedRooms = data.map((r) => ({
          ...r,
          amenities: r.amenities || [],
          capacity_min: r.capacity_min ?? 1,
          capacity_max: r.capacity_max ?? 1,
          base_price: r.base_price ?? 0,
        }));
        setRooms(sanitizedRooms);
      }
    });
  }, []);

  return (
    <section id="rooms" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block bg-primary/10 text-primary px-4 py-1.5 
                           rounded-full font-body text-sm font-medium mb-4"
          >
            Accommodations
          </span>
          <h2 className="section-title mb-4">Our Rooms &amp; Accommodations</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Choose from our thoughtfully designed rooms, each offering comfort
            and a unique connection to the beautiful farm environment.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms
            .filter(Boolean) // remove undefined/null
            .map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
        </div>
      </div>
    </section>
  );
}
