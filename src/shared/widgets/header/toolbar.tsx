"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

const Toolbar = () => {
  const { user } = useUser();

  return (
    <>
     
      {user ? (
        <>
          <Link href={"/dashboard"}>
            <Image
              src={user?.imageUrl}
              alt=""
              width={30}
              height={30}
              className="rounded-full"
            />
          </Link>

        </>
      ) : (
        <Link href={"/sign-in"}>
          <Button
            color="primary"
            className="bg-black text-white hover:bg-gray-800"
          >
            Sign In
          </Button>
        </Link>
      )}
    </>
  );
};

export default Toolbar;
