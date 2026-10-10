"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Book } from "@/lib/db";

export type BookDraft = Pick<Book, "title" | "author" | "why">;

/**
 * The one form for adding and editing a book, shown in a dialog. Mounting it fresh (its parent
 * keys it by the book being edited) resets the fields, so no effect is needed to pre-fill or clear.
 *
 * The title is required: submitting without one shows an inline error and changes nothing. Author
 * and the "why" note are optional — a book saved without them shows a card with just the title.
 */
export function BookFormDialog({
  open,
  book,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  /** The book being edited, or null when adding a new one. */
  book: Book | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: BookDraft) => Promise<void>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? "Edit book" : "Add a book"}</DialogTitle>
          <DialogDescription>
            {book
              ? "Change the details, then save."
              : "What do you want to read, and why?"}
          </DialogDescription>
        </DialogHeader>
        <BookForm key={`${book?.id ?? "new"}-${open}`} book={book} onSubmit={onSubmit} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function BookForm({
  book,
  onSubmit,
  onClose,
}: {
  book: Book | null;
  onSubmit: (draft: BookDraft) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [why, setWhy] = useState(book?.why ?? "");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const titleId = "book-title";
  const errorId = "book-title-error";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setTitleError("Give the book a title before saving.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ title: title.trim(), author: author.trim(), why: why.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor={titleId}>Title</Label>
          <Input
            id={titleId}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) setTitleError(null);
            }}
            placeholder="The Left Hand of Darkness"
            aria-required="true"
            aria-invalid={titleError ? true : undefined}
            aria-describedby={titleError ? errorId : undefined}
            autoFocus
          />
          {titleError && (
            <p id={errorId} role="alert" className="text-sm text-destructive">
              {titleError}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="book-author">Author (optional)</Label>
          <Input
            id="book-author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Ursula K. Le Guin"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="book-why">Why I want to read it (optional)</Label>
          <Textarea
            id="book-why"
            value={why}
            onChange={(event) => setWhy(event.target.value)}
            placeholder="Recommended after a conversation about how societies imagine gender…"
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {book ? "Save changes" : "Add"}
        </Button>
      </DialogFooter>
    </form>
  );
}