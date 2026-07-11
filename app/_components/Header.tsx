"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const menuOptions = [
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" },
];

const Header = () => {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-7 justify-between p-4 shadow relative">
        {/* logo */}
        <div className="flex gap-2 items-center">
          <Image src={"./logo.svg"} alt="logo" width={50} height={50} />
          <h2 className="font-bold sm:text-lg max-md:tracking-tight md:text-2xl">
            WebForge
          </h2>
        </div>

        {/* menu options */}
        <div className="flex items-center gap-3 max-md:hidden">
          {menuOptions.map((item) => (
            <Link key={item.name} href={item.path}>
              <Button variant={"ghost"}>{item.name}</Button>
            </Link>
          ))}
        </div>

        {/* Get started */}
        <div className="flex items-center gap-2">
          {!user ? (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <Button>
                Get Started <ArrowRight />
              </Button>
            </SignInButton>
          ) : (
            <Link href="/workspace">
              <Button>
                Go To Workspace <ArrowRight />
              </Button>
            </Link>
          )}

          {/* mobile nav button trigger */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center size-9.5 relative focus:outline-none group"
            aria-label="Toggle menu"
          >
            {/* Animated border ring */}
            <div
              className={`absolute inset-0 rounded-xl border-2 transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "border-primary scale-110 rotate-180 opacity-100"
                  : "border-transparent group-hover:border-gray-300 opacity-60"
              }`}
            ></div>

            {/* Gradient background on hover */}
            <div
              className={`absolute inset-0 rounded-xl bg-gradient-to-br transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "from-blue-500/10 to-purple-500/10 opacity-100 scale-105"
                  : "from-gray-100/50 to-gray-200/50 group-hover:from-blue-50 group-hover:to-purple-50 opacity-0 group-hover:opacity-100"
              }`}
            ></div>

            {/* Icon container */}
            <div className="relative w-6 h-4">
              {/* Top bar */}
              <div
                className={`absolute left-0 top-0 h-0.5 w-6 bg-gray-800 rounded-full origin-center transition-all duration-500 ease-out ${
                  isMenuOpen
                    ? "rotate-45 translate-y-[7px] bg-blue-600 w-6"
                    : "group-hover:w-7"
                }`}
              ></div>

              {/* Middle bar - morphs into circle */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-400 ease-out ${
                  isMenuOpen
                    ? "h-0 w-0 opacity-0"
                    : "h-0.5 w-6 bg-gray-800 rounded-full opacity-100 group-hover:w-5"
                }`}
              ></div>

              {/* Bottom bar */}
              <div
                className={`absolute left-0 bottom-0 w-6 bg-gray-800 rounded-full origin-center transition-all duration-500 ease-out ${
                  isMenuOpen
                    ? "-rotate-45 -translate-y-[7px] bg-blue-600 w-6 h-0.25"
                    : "group-hover:w-7 h-0.5"
                }`}
              ></div>

              {/* X icon middle dot for closed state */}
              <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? "h-0.5 w-0.5 bg-blue-600 rounded-full opacity-0"
                    : "h-1 w-1 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100"
                }`}
              ></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white shadow-md p-4 transition-all duration-300 transform ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        {menuOptions.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              {item.name}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Header;
