'use client'

import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r">
        <div className="p-4">
          <h1 className="text-xl font-bold">Law Office</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.route
              return (
                <li key={link.route}>
                  <Link
                    href={link.route}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Image
                      src={link.img}
                      alt={link.text}
                      width={24}
                      height={24}
                      className={isActive ? 'invert' : ''}
                    />
                    <span>{link.text}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 p-2 rounded-lg bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Image
          src="/icons/menu.svg"
          alt="Menu"
          width={24}
          height={24}
        />
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <aside className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="p-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">Law Office</h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Image
                  src="/icons/close.svg"
                  alt="Close"
                  width={24}
                  height={24}
                />
              </button>
            </div>
            <nav className="flex-1">
              <ul className="space-y-2 p-4">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.route
                  return (
                    <li key={link.route}>
                      <Link
                        href={link.route}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Image
                          src={link.img}
                          alt={link.text}
                          width={24}
                          height={24}
                          className={isActive ? 'invert' : ''}
                        />
                        <span>{link.text}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </>
  )
} 