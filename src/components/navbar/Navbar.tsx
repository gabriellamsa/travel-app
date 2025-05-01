"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  return (
    <nav className="bg-[#d6e9f3] shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" legacyBehavior>
              <a className="flex items-center space-x-2">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Nomadoo"
                  width={120}
                  height={40}
                  className="w-auto h-6 sm:h-8"
                  priority
                />
              </a>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {[
              { href: "/", label: "Home" },
              { href: "/trips", label: "My Trips" },
              { href: "/itinerary", label: "Itinerary" },
              { href: "/bookings", label: "Bookings" },
              { href: "/recommendations", label: "Recommendations" },
              { href: "/calendar", label: "Calendar" },
            ].map((item) => (
              <Link key={item.href} href={item.href} legacyBehavior>
                <a className="text-[#0078ba] hover:text-[#005c8e] text-sm lg:text-base transition-colors duration-200">
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-[#c0dfea] transition-colors duration-200"></button>
            <button className="bg-[#0078ba] text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-[#005c8e] transition-colors duration-200 text-sm lg:text-base">
              Login
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-[#0078ba] hover:text-[#005c8e] hover:bg-[#c0dfea] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#d6e9f3] w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { href: "/", label: "Home" },
              { href: "/trips", label: "My Trips" },
              { href: "/itinerary", label: "Itinerary" },
              { href: "/bookings", label: "Bookings" },
              { href: "/recommendations", label: "Recommendations" },
              { href: "/calendar", label: "Calendar" },
            ].map((item) => (
              <Link key={item.href} href={item.href} legacyBehavior>
                <a className="block px-3 py-2 rounded-md text-base font-medium text-[#0078ba] hover:text-[#005c8e] hover:bg-[#c0dfea] transition-colors duration-200">
                  {item.label}
                </a>
              </Link>
            ))}

            <button className="w-full mt-4 bg-[#0078ba] text-white px-4 py-2 rounded-lg hover:bg-[#005c8e] transition-colors duration-200">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
