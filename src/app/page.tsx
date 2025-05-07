"use client";

import MainLayout from "./components/UI/Mainlayout";
import Homecomponent from "./components/Home/Home";
import { useSession } from "next-auth/react";

export default function Home({ params }) {
  const { data: session } = useSession();
  return (
    <MainLayout className="bg-[#04c4ac] ">
      <div>{session ? <p></p> : <p></p>}</div>
      <Homecomponent />
    </MainLayout>
  );
}
