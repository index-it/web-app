"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/lists/")
  }, [router]);

  return <div className="flex flex-col items-center justify-center w-full gap-4">
    <Spinner />
  </div>
}