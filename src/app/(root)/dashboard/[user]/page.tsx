"use client"
import { usePathname } from "next/navigation"

const Page =  () => {
  const user = usePathname()
  console.log(user)
  return (
    <main>Page</main>
  )
}

export default Page