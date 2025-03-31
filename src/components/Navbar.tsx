import { NAV_LINKS } from "@/src/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const Navbar = () => {
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5">
      <Link href="/" aria-label="Home">
        <Image 
          src="/logo-transparent.png" 
          alt="Nomadoo Logo" 
          width={74} 
          height={29}
          priority
        />
      </Link>

      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-gray-50 flexCenter cursor-pointer transition-all hover:font-bold"
            aria-label={link.label}
          >
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="lg:flex hidden">
        <Button
          type="button"
          title="Login"
          icon="/user.svg"
          variant="btn_dark_green"
        />
      </div>

      <div className="relative lg:hidden">
        <input 
          type="checkbox" 
          id="menu-toggle" 
          className="peer sr-only" 
          aria-label="Toggle menu"
        />
        <label 
          htmlFor="menu-toggle"
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Menu"
        >
          <Image
            src="menu.svg"
            alt="Menu"
            width={32}
            height={32}
            className="inline-block"
          />
        </label>

        {/* mobile menu */}
        <div className="fixed inset-0 bg-white invisible opacity-0 peer-checked:visible peer-checked:opacity-100 transition-all duration-300 ease-in-out lg:hidden">
          <div className="flex flex-col h-full">

            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" aria-label="Home">
                <Image 
                  src="/logo-transparent.png" 
                  alt="Nomadoo Logo" 
                  width={74} 
                  height={29}
                />
              </Link>
              <label 
                htmlFor="menu-toggle"
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ul className="flex flex-col p-4 space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    href={link.href}
                    key={link.key}
                    className="regular-16 text-gray-50 flexCenter cursor-pointer transition-all hover:font-bold hover:text-green-50 py-3 px-4 rounded-lg hover:bg-gray-50"
                    aria-label={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </ul>
            </div>

            <div className="p-4 border-t">
              <Button
                type="button"
                title="Login"
                icon="/user.svg"
                variant="btn_dark_green"
                aria-label="Login"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
