"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createNote, updateNote } from "@/app/actions/notes";
import { Loader2 } from "lucide-react";

interface NoteEditorProps {
    noteId?: string;
    initialContent?: string;
    patientId: string;
    appointmentId?: string;
    onSaved?: () => void;
    placeholder?: string;
}

export function NoteEditor({ noteId, initialContent = "", patientId, appointmentId, onSaved, placeholder }: NoteEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        if (!content.trim()) return;
        setError(null);

        startTransition(async () => {
            let result;
            if (noteId) {
                result = await updateNote(noteId, content);
            } else {
                result = await createNote({ patientId, appointmentId, content });
            }

            if (result.success) {
                if (!noteId && !appointmentId) setContent(""); // Clear only if it's a general note (new entry in list)
                if (onSaved) onSaved();
            } else {
                setError(result.error || "Błąd zapisu");
            }
        });
    };

    return (
        <div className="space-y-2">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder || "Treść notatki..."}
                className="min-h-[100px]"
            />
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isPending || !content.trim()}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {noteId ? "Zaktualizuj" : "Zapisz notatkę"}
                </Button>
            </div>
        </div>
    );
}
