"use client"
import { usePathname, useRouter } from "next/navigation"
import { Briefcase, GraduationCap, BookmarkCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';

const Page =  () => {
  const user = usePathname()
  const router = useRouter()
  const { data: session } = useSession();
  console.log(user)

  const navigationItems = [
    {
      title: 'Applied Jobs',
      href: `/dashboard/${session?.user?.id}/applied-jobs`,
      icon: Briefcase
    },
    {
      title: 'Applied Scholarships',
      href: `/dashboard/${session?.user?.id}/applied-scholarships`,
      icon: GraduationCap
    },
    {
      title: 'Saved Jobs',
      href: `/dashboard/${session?.user?.id}/saved-jobs`,
      icon: BookmarkCheck
    },
    {
      title: 'Saved Scholarships',
      href: `/dashboard/${session?.user?.id}/saved-scholarships`,
      icon: BookmarkCheck
    }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '220px', background: '#18181b', color: '#fff', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {navigationItems.map((item) => (
          <button
            key={item.title}
            style={{ background: '#27272a', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.75rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => router.push(item.href)}
          >
            {item.title}
          </button>
        ))}
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>Page</main>
    </div>
  )
}

export default Page