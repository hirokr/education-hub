import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";

export default async function Home() {
  const session = await auth()
  return (
    <main>
      {session?.user?.id}
      <Button
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >
        signout
      </Button>
    </main>
  );
}
