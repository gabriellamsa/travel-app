"use client";

import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/map", label: "Maps" },
];

interface MobileNavProps {
  onToggleModal: () => void;
}

export default function MobileNav({ onToggleModal }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-2 md:hidden h-full">
      <button
        onClick={onToggleModal}
        className="p-2 rounded-full text-[var(--nomadoo-primary)] hover:text-[#005c8e] hover:bg-[#c0dfea] transition-colors duration-200 flex items-center justify-center"
        aria-label="Sign In"
      >
        <User className="h-6 w-6" />
      </button>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-[var(--nomadoo-primary)] hover:text-[#005c8e] hover:bg-[#c0dfea] transition-colors duration-200 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 right-4 w-48 bg-[var(--nomadoo-light)] shadow-lg rounded-xl p-4 z-50">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={handleLinkClick}
                  className="block text-[var(--nomadoo-primary)] hover:text-[#005c8e] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
