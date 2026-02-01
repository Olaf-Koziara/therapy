"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveAvailability, AvailabilityInput } from "@/app/actions/availability";
import { Loader2 } from "lucide-react";

const DAYS = [
    "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"
];

export default function AvailabilityPage({ initialData }: { initialData: AvailabilityInput[] }) {
    // Map initial data to form state (0-6)
    const [schedule, setSchedule] = useState<{
        active: boolean;
        start: string;
        end: string;
    }[]>(() => {
        const s = Array(7).fill(null).map(() => ({ active: false, start: "09:00", end: "17:00" }));
        initialData.forEach(d => {
            s[d.dayOfWeek] = { active: true, start: d.startTime, end: d.endTime };
        });
        return s;
    });

    const [isPending, startTransition] = useTransition();

    const handleSave = () => {
        const toSave: AvailabilityInput[] = schedule
            .map((day, idx) => day.active ? { dayOfWeek: idx, startTime: day.start, endTime: day.end } : null)
            .filter(x => x !== null) as AvailabilityInput[];

        startTransition(async () => {
            await saveAvailability(toSave);
        });
    };

    const toggleDay = (idx: number) => {
        const newS = [...schedule];
        newS[idx].active = !newS[idx].active;
        setSchedule(newS);
    };

    const updateTime = (idx: number, field: 'start' | 'end', val: string) => {
        const newS = [...schedule];
        newS[idx] = { ...newS[idx], [field]: val };
        setSchedule(newS);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Godziny Pracy</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Ustaw swoją dostępność</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {DAYS.map((dayName, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-2 border-b last:border-0">
                            <div className="w-32 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={schedule[idx].active}
                                    onChange={() => toggleDay(idx)}
                                    className="w-4 h-4"
                                />
                                <span className={schedule[idx].active ? "font-medium" : "text-slate-400"}>
                                    {dayName}
                                </span>
                            </div>
                            {schedule[idx].active ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="time"
                                        value={schedule[idx].start}
                                        onChange={(e) => updateTime(idx, 'start', e.target.value)}
                                        className="w-32"
                                    />
                                    <span>-</span>
                                    <Input
                                        type="time"
                                        value={schedule[idx].end}
                                        onChange={(e) => updateTime(idx, 'end', e.target.value)}
                                        className="w-32"
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-slate-400">Niedostępny</div>
                            )}
                        </div>
                    ))}
                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleSave} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Zapisz Zmiany
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
