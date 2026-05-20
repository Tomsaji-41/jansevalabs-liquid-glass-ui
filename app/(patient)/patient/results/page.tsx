import { FileText, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const MOCK_RESULTS = [
  {
    id: 1, orderNumber: "JL12ABC", testName: "Complete Blood Count (CBC)",
    date: "2024-01-15", status: "complete", reportUrl: "#",
    parameters: [
      { name: "Hemoglobin", value: "14.5", unit: "g/dL", range: "13.5–17.5", status: "normal" },
      { name: "WBC", value: "8200", unit: "cells/µL", range: "4500–11000", status: "normal" },
      { name: "Platelets", value: "145000", unit: "/µL", range: "150000–400000", status: "low" },
    ],
  },
  {
    id: 2, orderNumber: "JL12ABC", testName: "HbA1c",
    date: "2024-01-15", status: "complete", reportUrl: "#",
    parameters: [
      { name: "HbA1c", value: "6.8", unit: "%", range: "< 5.7", status: "high" },
    ],
  },
  {
    id: 3, orderNumber: "JL34DEF", testName: "Thyroid Profile",
    date: "2024-01-18", status: "pending", reportUrl: null,
    parameters: [],
  },
];

const STATUS_BADGE: Record<string, string> = {
  complete: "bg-teal-50 text-teal-700 border-teal-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  processing: "bg-purple-50 text-purple-700 border-purple-100",
};

export default function PatientResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F4E]">My Results</h1>
        <p className="text-slate-500 mt-1">All your diagnostic reports in one place.</p>
      </div>

      <div className="space-y-4">
        {MOCK_RESULTS.map((result) => (
          <div key={result.id} className="bg-white rounded-2xl border border-border shadow-card p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{result.testName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    #{result.orderNumber} · {formatDate(result.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={`border text-xs ${STATUS_BADGE[result.status] ?? ""}`}>
                  {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                </Badge>
                {result.reportUrl && (
                  <Button size="sm" variant="outline" className="border-[#0D9488] text-[#0D9488] hover:bg-teal-50">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    PDF
                  </Button>
                )}
              </div>
            </div>

            {result.parameters.length > 0 && (
              <>
                <div className="border-t border-border pt-4 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {result.parameters.map((param) => (
                      <div
                        key={param.name}
                        className={`px-3 py-2 rounded-xl text-sm border ${
                          param.status === "normal"
                            ? "bg-teal-50/50 border-teal-100"
                            : param.status === "low"
                            ? "bg-amber-50 border-amber-100"
                            : "bg-red-50 border-red-100"
                        }`}
                      >
                        <p className="text-xs text-slate-500 mb-0.5">{param.name}</p>
                        <p className={`font-bold ${
                          param.status === "normal" ? "text-teal-700" :
                          param.status === "low" ? "text-amber-700" : "text-red-700"
                        }`}>
                          {param.value} <span className="font-normal text-xs">{param.unit}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">Ref: {param.range}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <Link
                    href={`/patient/results/${result.id}`}
                    className="text-sm text-[#0D9488] hover:underline flex items-center gap-1"
                  >
                    View full report <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </>
            )}

            {result.status === "pending" && (
              <div className="mt-3 text-sm text-amber-600 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                Your sample is being processed. Results will be available within 24 hours.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
