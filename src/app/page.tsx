import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">
        Frontend Template
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">A small, strict Next.js foundation.</h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        This starter keeps the dependency surface small and the UI boundaries explicit.
      </p>
      <Link
        className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        href="/example"
      >
        View example
      </Link>
    </main>
  );
}
