import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("https://github.com/ni5arga/lastly");
  }, [router]);

  return null; 
}
