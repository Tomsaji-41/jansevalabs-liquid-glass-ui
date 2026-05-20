import { ArrowLeft, FileText, Download, Phone, FlaskConical } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, cn } from "@/lib/utils";

async function getResultsByMobile(_mobile: string) {
  return [
    {
      id: 1, testName: "Complete Blood Count (CBC)", orderNumber: "JL12ABC",
      date: "2024-01-15", status: "complete", reportUrl: "#",
      parameters: [
        { name: "Hemoglobin", value: "14.5", unit: "g/dL", range: "13.5–17.5", status: "normal" },
        { name: "WBC", value: "8200", unit: "cells/µL", range: "4500–11000", status: "normal" },
        { name: "Platelets", value: "145000", unit: "/µL", range: "150000–400000", status: "low" },
      ],
    },
  ];
}

export default async function QuickResultViewPage({
  params,
}: {
  params: { mobile: string };
}) {
  const results = await getResultsByMobile(params.mobile);

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Link
          href="/results"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0D9488] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-gradient flex items-center justify-center">
            <FlaskConical className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display italic text-lg text-[#0B1F4E]">Janseva</span>
        </div>
        <a href="tel:+911800000000" className="flex items-center gap-1.5 text-sm text-[#0D9488]">
          <Phone className="w-4 h-4" />
          Help
        </a>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#0B1F4E]">Your Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Mobile: +91 {params.mobile} · {results.length} test(s) found
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No reports found for this mobile number.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-2xl border border-border shadow-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-slate-800">{result.testName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      #{result.orderNumber} · {formatDate(result.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-teal-50 text-teal-700 border-teal-100 border text-xs">
                      Report Ready
                    </Badge>
                    {result.reportUrl && (
                      <a
                        href={result.reportUrl}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-[#0D9488] text-[#0D9488]")}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.parameters.map((param) => (
                    <div
                      key={param.name}
                      className={`px-3 py-2.5 rounded-xl border text-sm ${
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
                        {param.value}{" "}
                        <span className="font-normal text-xs">{param.unit}</span>
                        {param.status !== "normal" && (
                          <span className="ml-1 text-[10px] uppercase font-bold">
                            ({param.status})
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400">Ref: {param.range}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-3">
            Want to save your reports and track your health over time?
          </p>
          <Link
            href="/sign-up"
            className={cn(buttonVariants(), "bg-[#0D9488] hover:bg-[#0F766E] text-white")}
          >
            Create a Patient Account
          </Link>
        </div>
      </div>
    </div>
  );
}
