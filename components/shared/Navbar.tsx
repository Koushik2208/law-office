'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ModeToggle } from '../mode-toggle'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cases', label: 'Cases' },
    { href: '/lawyers', label: 'Lawyers' },
    { href: '/courts', label: 'Courts' },
    { href: '/clients', label: 'Clients' },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-foreground hover:bg-accent"
              aria-label="Toggle menu"
            >
              <Image
                src={isOpen ? "/icons/close.svg" : "/icons/menu.svg"}
                alt={isOpen ? "Close menu" : "Open menu"}
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </button>
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/logo.svg"
                alt="Law Office Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="ml-2 text-xl font-bold">Law Office</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden fixed inset-0 top-16 bg-background transition-all duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
} 