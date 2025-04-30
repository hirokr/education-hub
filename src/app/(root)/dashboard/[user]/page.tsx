"use client"
import { usePathname, useRouter } from "next/navigation"
import { Briefcase, GraduationCap, BookmarkCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React from 'react'

const Page = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession();

  const navigationItems = [
    {
      title: 'Saved',
      items: [
        {
          title: 'Saved Jobs',
          href: `/dashboard/${session?.user?.id}/saved-jobs`,
          icon: Briefcase
        },
        {
          title: 'Saved Scholarships',
          href: `/dashboard/${session?.user?.id}/saved-scholarships`,
          icon: GraduationCap
        }
      ]
    },
    {
      title: 'Applied',
      items: [
        {
          title: 'Applied Jobs',
          href: `/dashboard/${session?.user?.id}/applied-jobs`,
          icon: Briefcase
        },
        {
          title: 'Applied Scholarships',
          href: `/dashboard/${session?.user?.id}/applied-scholarships`,
          icon: GraduationCap
        }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#18181b]">
      <aside className="w-72 h-full bg-white dark:bg-zinc-900 text-black dark:text-white p-6 flex flex-col gap-4 shadow-xl rounded-r-2xl border-r border-gray-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Dashboard</h2>
        </div>
        <div className="border-b border-gray-200 dark:border-zinc-800 mb-4"></div>
        <div className="space-y-6">
          {navigationItems.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                <BookmarkCheck className="h-7 w-7 text-black dark:text-[#d1e6ff]" />
                <span>{section.title}</span>
              </div>
              <div className="flex flex-col gap-2 pl-6">
                {section.items.map((item) => (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                      "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-[#23272f] dark:hover:text-[#d1e6ff]",
                      pathname === item.href && "bg-blue-100 text-blue-700 dark:bg-[#1e293b] dark:text-[#d1e6ff] shadow-md"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    {item.icon === GraduationCap
                      ? <div className="flex items-center text-3xl"><GraduationCap className="h-6 w-6 text-black dark:text-[#d1e6ff]" /></div>
                      : React.createElement(item.icon, { className: "h-6 w-6 text-black dark:text-[#d1e6ff]" })}
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1"></div>
        {/* Optional: Add user avatar or footer here */}
      </aside>
      
      <main className="flex-1 p-10 bg-white dark:bg-[#18181b] transition-colors duration-300">
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold mb-8 tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add your dashboard content here */}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Page