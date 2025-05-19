import React from "react";
import Link from "next/link";
import { Home, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[var(--nomadoo-primary)]">
              Nomadoo
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Find and organize your trips easily! Your perfect travel companion
              for seamless journey planning.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-[var(--nomadoo-primary)]" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[var(--nomadoo-primary)] rounded-full group-hover:scale-150 transition-transform"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[var(--nomadoo-primary)] rounded-full group-hover:scale-150 transition-transform"></span>
                  Map
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--nomadoo-primary)]" />
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[var(--nomadoo-primary)] rounded-full group-hover:scale-150 transition-transform"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[var(--nomadoo-primary)] rounded-full group-hover:scale-150 transition-transform"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Nomadoo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
