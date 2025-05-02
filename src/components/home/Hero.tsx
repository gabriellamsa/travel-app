"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white w-full py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-16">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--nomadoo-primary)] mb-8">
            Plan your trip, the smart way.
          </h1>
          <p className="text-lg text-[#453B37] mb-10">
            Nomadoo is your all-in-one travel planner. From flights and hotels
            to daily itineraries, keep your entire journey organized in one
            place.
          </p>
          <Link href="/trips">
            <span className="inline-block bg-[var(--nomadoo-primary)] hover:bg-[#005c8e] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer">
              Start Planning
            </span>
          </Link>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/hero-travel.png"
            alt="Travel planning illustration"
            width={500}
            height={400}
            className="w-full h-auto max-w-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
