import Image from "next/image";

export default function CallbackEmailVerificationSuccessPage() {
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

      <p className="text-2xl font-semibold text-center mt-8">Your email has been verified!</p>

      <p className="text-lg text-center mt-2">You can close this page now ;)</p>
    </>
  )
}