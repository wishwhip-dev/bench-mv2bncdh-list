import Link from "next/link";
import { BookList } from "@/components/book-list";
import { Button } from "@/components/ui/button";
import { identity } from "./identity";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{identity.name}</h1>
          <p className="mt-1 text-muted-foreground">
            Books you want to read, with a line on why — ticked off as you finish them.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/settings">Settings</Link>
        </Button>
      </header>
      <BookList />
    </main>
  );
}