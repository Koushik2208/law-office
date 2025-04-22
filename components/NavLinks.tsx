"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto">
      <ul className="space-y-2 p-4">
        {sidebarLinks.map((link) => {
          const isSelected =
            (link.route !== "/" &&
              pathname?.includes(link.route) &&
              link.route.length > 0) ||
            pathname === link.route;
          return (
            <li key={link.route}>
              <Link
                href={link.route}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Image
                  src={link.img}
                  alt={link.text}
                  width={24}
                  height={24}
                  className={isSelected ? "invert" : ""}
                />
                <span>{link.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavLinks;
