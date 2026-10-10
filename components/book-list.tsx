"use client";

import { useState } from "react";
import { BookCard } from "@/components/book-card";
import { BookFormDialog, type BookDraft } from "@/components/book-form-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { addBook, deleteBook, listBooks, setBookDone, updateBook } from "@/lib/data/books";
import { database, type Book } from "@/lib/db";
import { useStorageStatus, useStoredQuery } from "@/lib/storage/react";
import { toast } from "sonner";

/**
 * The reading list itself: live from the browser database, with the add/edit form, the delete
 * confirmation, the counts and the empty state.
 */
export function BookList() {
  const { data, isLoading } = useStoredQuery(database, listBooks);
  const storage = useStorageStatus(database);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);

  const books = data ?? [];
  const unread = books.filter((book) => !book.done);
  const done = books.filter((book) => book.done);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(book: Book) {
    setEditing(book);
    setFormOpen(true);
  }

  async function handleSubmit(draft: BookDraft) {
    try {
      if (editing) {
        await updateBook(editing.id, draft);
        toast.success("Changes saved");
      } else {
        await addBook(draft);
        toast.success("Book added");
      }
    } catch (error) {
      toast.error(`Could not save: ${error instanceof Error ? error.message : "unknown error"}`);
      throw error;
    }
  }

  async function handleToggleDone(book: Book, value: boolean) {
    try {
      await setBookDone(book.id, value);
      toast.success(value ? `Marked “${book.title}” as read` : `Moved “${book.title}” back to the list`);
    } catch (error) {
      toast.error(`Could not update: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    const book = deleting;
    setDeleting(null);
    try {
      await deleteBook(book.id);
      toast.success(`Deleted “${book.title}”`);
    } catch (error) {
      toast.error(`Could not delete: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  return (
    <section aria-label="Reading list">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button onClick={openAdd}>Add book</Button>
        {!isLoading && books.length > 0 && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {unread.length} waiting · {done.length} done
          </p>
        )}
      </div>

      {storage === "memory" && (
        <Alert className="mb-4">
          <AlertTitle>This browser will not keep your list</AlertTitle>
          <AlertDescription>
            Site data is blocked here, so the list is only in memory. Use Settings to export it to a
            file before you close the page.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-3" aria-hidden="true">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : books.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="grid gap-6">
          <section aria-label="Books to read">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              To read <Badge variant="secondary">{unread.length}</Badge>
            </h2>
            {unread.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Nothing waiting — every book on the list is read.
              </p>
            ) : (
              <ul className="grid gap-3">
                {unread.map((book) => (
                  <li key={book.id}>
                    <BookCard
                      book={book}
                      onToggleDone={(value) => handleToggleDone(book, value)}
                      onEdit={() => openEdit(book)}
                      onDelete={() => setDeleting(book)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {done.length > 0 && (
            <section aria-label="Finished books">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Done <Badge variant="secondary">{done.length}</Badge>
              </h2>
              <ul className="grid gap-3">
                {done.map((book) => (
                  <li key={book.id}>
                    <BookCard
                      book={book}
                      onToggleDone={(value) => handleToggleDone(book, value)}
                      onEdit={() => openEdit(book)}
                      onDelete={() => setDeleting(book)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <BookFormDialog
        open={formOpen}
        book={editing}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete book?</DialogTitle>
            <DialogDescription>
              This removes {deleting ? `“${deleting.title}”` : "this book"} from your list, for good.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <p className="text-lg font-medium">Your list is empty</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Add the first book you want to read — with a line on why, so future you remembers what the
        point was.
      </p>
      <Button className="mt-4" onClick={onAdd}>
        Add your first book
      </Button>
    </div>
  );
}