/**
 * The reading list's data-access functions. Components call these, never Dexie directly.
 */
import { database, newId, type Book } from "@/lib/db";

const books = async () => (await database.ready()).books;

/**
 * The whole list, ready to render: unread books first, newest of each group on top. The Done
 * section is ordered by when the book was last changed, so the one finished most recently leads.
 */
export async function listBooks(): Promise<Book[]> {
  const all = await (await books()).toArray();
  return all.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const key = a.done ? "updatedAt" : "createdAt";
    return b[key] - a[key];
  });
}

export async function addBook(input: Pick<Book, "title" | "author" | "why">): Promise<Book> {
  const now = Date.now();
  const book: Book = { id: newId(), done: false, createdAt: now, updatedAt: now, ...input };
  await (await books()).add(book);
  return book;
}

export async function updateBook(id: string, input: Pick<Book, "title" | "author" | "why">): Promise<void> {
  await (await books()).update(id, { title: input.title, author: input.author, why: input.why, updatedAt: Date.now() });
}

export async function setBookDone(id: string, done: boolean): Promise<void> {
  await (await books()).update(id, { done, updatedAt: Date.now() });
}

export async function deleteBook(id: string): Promise<void> {
  await (await books()).delete(id);
}
