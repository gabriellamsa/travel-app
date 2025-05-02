import { LucideCalendarHeart } from "lucide-react";

import { LuPlane } from "react-icons/lu";
import { MdHotel } from "react-icons/md";
import { TbMapPin2 } from "react-icons/tb";

const features = [
  {
    icon: <LuPlane className="w-12 h-12 text-sky-400" />,
    title: "Flights",
    description:
      "Import and organize your flight bookings from any travel service",
  },
  {
    icon: <MdHotel className="w-12 h-12 text-rose-400" />,
    title: "Accommodations",
    description:
      "Sync your hotel and lodging reservations from any booking platform",
  },
  {
    icon: <LucideCalendarHeart className="w-12 h-12 text-amber-400" />,
    title: "Itineraries",
    description: "Create and manage your daily travel plans with ease",
  },
  {
    icon: <TbMapPin2 className="w-12 h-12 text-emerald-400" />,
    title: "Attractions",
    description: "Save and organize your must-visit places and activities",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-[var(--nomadoo-light)]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-[var(--nomadoo-primary)]">
          Everything you need to organize your trip
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2 text-[var(--nomadoo-primary)]">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
