"use client";

import { useState } from "react";
import MobileNav from "./MobileNav";
import ResponsiveNav from "./ResponsiveNav";
import Modal from "./Modal";
import SignInModal from "../common/SignInModal";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <header className="w-full fixed top-0 left-0 bg-[var(--nomadoo-light)] shadow-md z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link href="/" legacyBehavior>
            <a className="flex items-center space-x-2 h-full">
              <Image
                src="/images/logo-transparent.png"
                alt="Nomadoo"
                width={120}
                height={40}
                className="w-auto h-6 sm:h-8 my-auto"
                priority
              />
            </a>
          </Link>

          <div className="flex items-center h-full">
            <ResponsiveNav onToggleModal={handleToggleModal} />
            <MobileNav onToggleModal={handleToggleModal} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleToggleModal}>
          <SignInModal onClose={handleToggleModal} />
        </Modal>
      )}
    </header>
  );
}
