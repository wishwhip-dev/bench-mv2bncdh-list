"use client";

import { useState } from "react";
import Link from "next/link";
import { FileDrop } from "@/components/file-drop";
import { MovePanel } from "@/components/move-panel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { database } from "@/lib/db";
import { parseExport, readExportFile, type StorageExport } from "@/lib/storage/transfer";
import { useDatabaseTransfer } from "@/lib/storage/react";
import { toast } from "sonner";

/**
 * Settings: the "Move to another device" panel, plus a file copy of the list for backing it up or
 * carrying it by hand (preview and published site are different origins, so a file is the honest
 * fallback — see docs/storage.md).
 */
export default function SettingsPage() {
  const { state, exportToFile, importFromFile } = useDatabaseTransfer(database);
  const [pending, setPending] = useState<{ file: File; data: StorageExport } | null>(null);

  const importResult =
    state.kind === "imported"
      ? `Imported ${Object.entries(state.result.tables)
          .map(([name, count]) => `${count} into ${name}`)
          .join(", ")}.`
      : state.kind === "error"
        ? state.message
        : null;

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    try {
      const data = parseExport(await readExportFile(file), database);
      setPending({ file, data });
    } catch (error) {
      toast.error(`That file is not a Reading list export: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  async function confirmImport(mode: "replace" | "merge") {
    if (!pending) return;
    setPending(null);
    await importFromFile(pending.file, mode);
  }

  const bookCount = pending
    ? (pending.data.tables.books as unknown[] | undefined)?.length ?? 0
    : 0;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/">← Back to the list</Link>
      </Button>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Move to another device</CardTitle>
            <CardDescription>
              Your list lives in this browser. To use it on your phone and your laptop, move a copy
              from one to the other with a one-time code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MovePanel database={database} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Back up to a file</CardTitle>
            <CardDescription>
              Save the whole list as a file you can keep, or bring it back here (or into the app on
              another device) later.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Button onClick={() => void exportToFile()}>Export to a file</Button>
              <p className="mt-2 text-sm text-muted-foreground">
                Downloads a JSON file with every book, including which ones are done.
              </p>
            </div>
            <div>
              <FileDrop accept=".json,application/json" label="Choose a backup file" onFiles={handleFile} maxBytes={5_000_000}>
                <p className="text-sm text-muted-foreground">A file previously exported from this app.</p>
              </FileDrop>
              {importResult && (
                <Alert className="mt-3">
                  <AlertTitle>{state.kind === "error" ? "Import did not finish" : "File imported"}</AlertTitle>
                  <AlertDescription>{importResult}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Use this file?</DialogTitle>
            <DialogDescription>
              The file holds {bookCount} {bookCount === 1 ? "book" : "books"}. Replacing empties this
              device&apos;s list first; merging keeps what is here and adds the file&apos;s books.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => void confirmImport("merge")}>
              Merge into list
            </Button>
            <Button variant="destructive" onClick={() => void confirmImport("replace")}>
              Import and replace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}