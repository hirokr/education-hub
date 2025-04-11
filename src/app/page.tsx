import { FlipWords } from "@/components/custom/flip-words";
import { TextGenerateEffect } from "@/components/custom/text-generate-effect";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const words = ["Scholarship", "Dream Job", "Future", "Skills"];
  const text = "Get your Scholarship, Dream Job, Future, Skills with EduHub";
  return (
    <main>
      <section className='h-[40rem] flex flex-col justify-center items-center px-4'>
        <div className='text-3xl sm:text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 mb-10'>
          Get your
          <FlipWords words={words} /> <br />
          With EduHub
        </div>
        <TextGenerateEffect words={text} />
        <div className='flex justify-center items-center gap-5 mt-10'>
          <Link href='/sign-up'>
            <Button variant={"outline"} className='cursor-pointer'>
              Get Started Today
            </Button>
          </Link>
          <Link href='/about'>
            <Button variant={"default"} className='cursor-pointer'>
              Explore
            </Button>
          </Link>
        </div>
        
      </section>
      
    </main>
  );
}
