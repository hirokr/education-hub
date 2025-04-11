"use client";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      link: "/Scholarship",
    },
  ];

  if (session?.user) {
    navItems.push({
      name: "Dashboard",
      link: "/dashboard",
    });
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='relative w-full'>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className='flex items-center gap-4'>
            {!session?.user && pathname !== "/sign-in" && (
              <NavbarButton variant='primary' href='/sign-in'>
                Login
              </NavbarButton>
            )}
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={session?.user?.image as string} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href='/dashboard'>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link href='/resume-analyze'>
                    <DropdownMenuItem>Analyse </DropdownMenuItem>
                  </Link>
                  <Link href='/dashboard'>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant='primary'
                    className='w-full'
                    onClickCapture={() => {
                      signOut();
                    }}
                  >
                    Sign Out
                  </NavbarButton>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
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
              {session?.user ? (
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant='primary'
                  className='w-full'
                  onClickCapture={() => {
                    signOut();
                  }}
                >
                  Sign Out
                </NavbarButton>
              ) : (
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
