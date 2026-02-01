"use client"

import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Note = {
    id: string;
    content: string;
    createdAt: Date;
    appointment?: {
        startDateTime: Date;
        type: string;
    } | null;
}

export function NoteList({ notes }: { notes: Note[] }) {
    if (notes.length === 0) {
        return <div className="text-center text-slate-500 py-8">Brak notatek.</div>;
    }

    return (
        <div className="space-y-4">
            {notes.map(note => (
                <Card key={note.id}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-slate-500">
                                {format(new Date(note.createdAt), "yyyy-MM-dd HH:mm")}
                            </div>
                            {note.appointment ? (
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80">
                                    Wizyta: {format(new Date(note.appointment.startDateTime), "yyyy-MM-dd")}
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-slate-900">
                                    Ogólna
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
