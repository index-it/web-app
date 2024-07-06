import Image from "next/image";

export default function CallbackEmailVerificationErrorPage() {
  return (
    <>
      <Image
        src="/logo.png"
        width={500}
        height={500}
        alt="Index logo"
        className="size-20 rounded-2xl shadow-xl border border-border select-none"
        draggable={false}
      />

      <p className="text-2xl font-semibold text-center mt-8">We couldn&apos;t verify your email :/<br /><br />Try requesting a new verification email in the app!</p>
    </>
  )
}