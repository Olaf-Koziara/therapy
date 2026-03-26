"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createNote, updateNote, getNoteHistory } from "@/app/actions/notes";
import { Loader2, History, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface NoteEditorProps {
    noteId?: string;
    initialContent?: string;
    patientId: string;
    appointmentId?: string;
    onSaved?: () => void;
    placeholder?: string;
}

const SOAP_TEMPLATE = `**S (Subiektywne):**
-

**O (Obiektywne):**
-

**A (Ocena):**
-

**P (Plan):**
- `;

export function NoteEditor({ noteId, initialContent = "", patientId, appointmentId, onSaved, placeholder }: NoteEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [historyOpen, setHistoryOpen] = useState(false);

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

    const insertTemplate = () => {
        setContent(prev => prev + (prev ? "\n\n" : "") + SOAP_TEMPLATE);
    };

    const insertFormat = (tag: string) => {
        // Simple append for MVP. Real cursor insertion requires refs and selection API.
        setContent(prev => prev + tag);
    };

    const loadHistory = async () => {
        if (!noteId) return;
        const data = await getNoteHistory(noteId);
        setHistory(data);
        setHistoryOpen(true);
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2 mb-1">
                <Button variant="outline" size="sm" onClick={() => insertFormat("**text**")} title="Pogrubienie">B</Button>
                <Button variant="outline" size="sm" onClick={() => insertFormat("- ")} title="Lista">List</Button>
                <Button variant="outline" size="sm" onClick={insertTemplate} title="Szablon SOAP">SOAP</Button>

                {noteId && (
                    <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                        <DialogTrigger asChild>
                             <Button variant="ghost" size="sm" onClick={loadHistory} className="ml-auto">
                                <History className="w-4 h-4 mr-1" /> Historia
                             </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Historia zmian</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {history.map((ver) => (
                                    <div key={ver.id} className="border p-3 rounded bg-slate-50">
                                        <div className="text-xs text-slate-500 mb-2 flex justify-between">
                                            <span>Wersja {ver.version}</span>
                                            <span>{format(new Date(ver.createdAt), "yyyy-MM-dd HH:mm")}</span>
                                        </div>
                                        <p className="whitespace-pre-wrap text-sm">{ver.content}</p>
                                    </div>
                                ))}
                                {history.length === 0 && <p className="text-center text-sm">Brak historii.</p>}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder || "Treść notatki..."}
                className="min-h-[150px] font-mono text-sm"
            />
            {error && <div role="alert" className="text-sm text-red-500">{error}</div>}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isPending || !content.trim()}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {noteId ? "Zaktualizuj" : "Zapisz notatkę"}
                </Button>
            </div>
        </div>
    );
}
