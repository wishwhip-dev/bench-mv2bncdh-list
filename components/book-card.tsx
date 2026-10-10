"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Book } from "@/lib/db";
import { cn } from "@/lib/utils";

/**
 * One book on the list: its checkbox, title, author and the note on why. Done books get a quieter,
 * visibly finished style. `break-words` keeps very long titles and notes on the card instead of
 * stretching it.
 */
export function BookCard({
  book,
  onToggleDone,
  onEdit,
  onDelete,
}: {
  book: Book;
  onToggleDone: (done: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card
      className={cn(
        "gap-3 py-4 transition-colors",
        book.done && "border-dashed bg-muted/40",
      )}
    >
      <CardContent className="flex items-start gap-3 px-4">
        <Checkbox
          checked={book.done}
          onCheckedChange={(checked) => onToggleDone(checked === true)}
          aria-label={book.done ? `Mark “${book.title}” as not read` : `Mark “${book.title}” as read`}
          className="mt-0.5 size-8 rounded-md"
        />
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "font-medium leading-snug break-words",
              book.done && "text-muted-foreground line-through decoration-2",
            )}
          >
            {book.title}
          </h3>
          {book.author && (
            <p className="mt-0.5 text-sm text-muted-foreground break-words">{book.author}</p>
          )}
          {book.why && (
            <p className="mt-2 text-sm leading-relaxed break-words text-pretty">{book.why}</p>
          )}
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} disabled={book.done ? false : false}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}