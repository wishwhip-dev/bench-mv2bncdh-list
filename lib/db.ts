/**
 * This application's database.
 *
 * The reusable half of the setup is in `lib/storage/` and is not edited. This file is the half
 * that describes the product: which tables exist, what is indexed, how the schema has changed over
 * time, and what a first visit starts with.
 *
 * This is the first release, so there is one version and no seed: the reading list opens empty and
 * the page invites the visitor to add their first book. The "never edit a shipped version" rule in
 * `docs/storage.md` binds from the first deployment onward, not before it.
 */
import { defineDatabase } from "@/lib/storage/database";

export type Book = {
  id: string;
  title: string;
  /** Optional — a card with no author just shows the title. */
  author: string;
  /** The note on why the book is on the list. Optional for the same reason. */
  why: string;
  done: boolean;
  /** Epoch millis. Indexed, because the unread list is ordered by it (newest first). */
  createdAt: number;
  /** Epoch millis — when the book last changed, used to order the Done section. */
  updatedAt: number;
};

/** Ids are generated here so the data layer never depends on an auto-increment round trip. */
export function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const database = defineDatabase<{ books: Book }>({
  // Part of the origin's storage identity. Renaming it does not migrate anything — it points the
  // application at a different, empty database and abandons the old one in place. That is exactly
  // what you want on a first build, and never what you want afterwards.
  name: "reading-list",
  versions: [
    // Only the primary key and the properties queried on. `title`, `author` and `why` are stored
    // but never filtered or sorted by, so indexing them would cost writes and buy nothing.
    { version: 1, stores: { books: "id, createdAt" } },
  ],
});
