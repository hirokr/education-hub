"use client";
import { useSession } from "next-auth/react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./resizable-navbar";
import { useState } from "react";

import { usePathname } from "next/navigation";
import GetUser from "./getUser";
import { ModeToggle } from "./themeToggle";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Community",
      link: "/community",
    },
    {
      name: "Jobs",
      link: "/jobs",
    },
    {
      name: "Scholarship",
      link: "/scholarships",
    },
    {
      name: "Resources",
      link: "/resources",
    }
  ];


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='relative w-full'>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className='flex items-center gap-4 mr-20'>
            <ModeToggle />
            {!session?.user && pathname !== "/sign-in" && (
              <NavbarButton variant='primary' href='/sign-in'>
                Login
              </NavbarButton>
            )}
            {session?.user && (
              <GetUser setIsMobileMenuOpen={setIsMobileMenuOpen} />
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className='flex items-center gap-4 '>
            <ModeToggle />
              {session?.user && pathname !== "/sign-in" && (
                <GetUser setIsMobileMenuOpen={setIsMobileMenuOpen} />
              )}
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className='relative text-neutral-600 dark:text-neutral-300'
              >
                <span className='block'>{item.name}</span>
              </a>
            ))}
            <div className='flex w-full flex-col gap-4'>
              {!session?.user && (
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant='primary'
                  className='w-full'
                  href='/sign-in'
                >
                  Login
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}
