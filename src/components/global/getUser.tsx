import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { NavbarButton } from "./resizable-navbar";
import { signOut, useSession } from "next-auth/react";

const GetUser: React.FC<{ setIsMobileMenuOpen: (value: boolean) => void }> = ({ setIsMobileMenuOpen }) => {
  const { data: session } = useSession();
  return (
    <>
      <DropdownMenu >
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session?.user?.image as string} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="
          w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 *:cursor-pointer">
          <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <Link href='/resume-analyze'>
            <DropdownMenuItem>Analyse </DropdownMenuItem>
          </Link>
          <Link href={`/dashboard/${session?.user?.id}`}>
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </Link>
          <NavbarButton
            onClick={() => {
              setIsMobileMenuOpen(false)
              signOut()
            }
            }
            variant='primary'
            className='w-full'
          >
            Sign Out
          </NavbarButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default GetUser;
