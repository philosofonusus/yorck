import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await currentUser();
  if (user) {
    redirect("/lists");
  } else {
    redirect("/signin");
  }
  return <></>;
}
