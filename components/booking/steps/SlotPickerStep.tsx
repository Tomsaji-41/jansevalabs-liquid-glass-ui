"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookingData } from "../BookingWizard";

const SLOTS = [
  "6:00 AM – 8:00 AM",
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];

function getNext7Days() {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
    });
  }
  return days;
}

interface Props {
  data: Partial<BookingData>;
  onNext: (data: Partial<BookingData>) => void;
  onBack: () => void;
}

export default function SlotPickerStep({ data, onNext, onBack }: Props) {
  const [selectedDate, setSelectedDate] = useState(data.date ?? "");
  const [selectedSlot, setSelectedSlot] = useState(data.slot ?? "");
  const days = getNext7Days();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-1">Choose Date & Time</h2>
        <p className="text-sm text-blue-600">
          {data.collectionMode === "home"
            ? "Select when you'd like our phlebotomist to visit."
            : "Select your preferred walk-in date and time."}
        </p>
      </div>

      {/* Date picker */}
      <div>
        <p className="text-sm font-semibold text-blue-800 mb-3">Select Date</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {days.map((day) => (
            <button
              key={day.value}
              onClick={() => setSelectedDate(day.value)}
              className={cn(
                "flex-none flex flex-col items-center px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all min-w-[72px]",
                selectedDate === day.value
                  ? "border-[#0D9488] bg-teal-50 text-[#0D9488]"
                  : "border-white/20 bg-white/5 backdrop-blur-md text-blue-700 hover:border-slate-300"
              )}
            >
              {day.label.split(" ").map((part, i) => (
                <span key={i} className={i === 0 ? "text-xs text-blue-500 font-normal" : "font-semibold"}>
                  {part}
                </span>
              ))}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0D9488]" />
            Available Slots
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-center transition-all",
                  selectedSlot === slot
                    ? "border-[#0D9488] bg-teal-50 text-[#0D9488]"
                    : "border-white/20 bg-white/5 backdrop-blur-md text-blue-700 hover:border-slate-300"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 text-black">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={() => onNext({ date: selectedDate, slot: selectedSlot })}
          disabled={!selectedDate || !selectedSlot}
          className="flex-1 bg-[#0B1F4E] hover:bg-navy-900 text-white h-11 font-semibold flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
