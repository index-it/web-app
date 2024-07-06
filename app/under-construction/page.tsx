import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";

export default function UnderConstructionPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full h-full px-4 gap-4">
        <Image
          src="/logo.png"
          width={500}
          height={500}
          alt="Index logo"
          className="size-20 rounded-2xl shadow-xl border border-border select-none"
          draggable={false}
        />

        <p className="text-2xl font-semibold text-center">The web app is currently under construction :P</p>
        <Link href="https://index-it.app" className={buttonVariants() + " gap-2 justify-start"}>
          <Icon icon="ph:download-simple-bold" className="size-4" />
          Download the app
        </Link>
      </main>
    </>
  )
}