import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5">
      <Link href="/">
        <Image src="/logo-transparent.png" alt="logo" width={74} height={29} />
      </Link>

      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-gray-50 flexCenter cursor-pointer transition-all hover:font-bold"
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};
