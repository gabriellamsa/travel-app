"use client";

import Link from "next/link";
import { User } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/map", label: "Maps" },
];

interface ResponsiveNavProps {
  onToggleModal: () => void;
}

export default function ResponsiveNav({ onToggleModal }: ResponsiveNavProps) {
  return (
    <div className="hidden md:flex items-center justify-between space-x-6 h-full">
      <ul className="flex items-center space-x-6 h-full">
        {links.map((link) => (
          <li key={link.href} className="h-full flex items-center">
            <Link
              href={link.href}
              className="text-[var(--nomadoo-primary)] hover:text-[#005c8e] text-sm lg:text-base transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={onToggleModal}
        className="p-2 rounded-full text-[var(--nomadoo-primary)] hover:text-[#005c8e] hover:bg-[#c0dfea] transition-colors duration-200 flex items-center justify-center"
        aria-label="Sign In"
      >
        <User className="h-6 w-6" />
      </button>
    </div>
  );
}
