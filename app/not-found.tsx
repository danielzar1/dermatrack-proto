import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-deep">
        Lost the thread
      </p>
      <h1 className="mt-2 font-serif text-[36px] text-navy-deep">404</h1>
      <p className="mt-2 max-w-sm text-[14px] text-ink-soft">
        That URL doesn’t exist in this prototype. Head back to the cover and
        pick a side.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-navy px-5 py-3 text-[13.5px] font-semibold text-white"
      >
        Back to DermaTrack
      </Link>
    </main>
  );
}
