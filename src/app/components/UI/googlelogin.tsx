"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>

      <button
        onClick={() => signOut()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;

