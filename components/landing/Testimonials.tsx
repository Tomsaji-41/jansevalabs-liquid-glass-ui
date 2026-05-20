import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Menon",
    location: "Kochi",
    rating: 5,
    text: "I was so impressed! The phlebotomist arrived exactly on time, was very professional, and my reports were ready the same evening. No need to visit the lab at all.",
    date: "3 weeks ago",
  },
  {
    name: "Rajesh Kumar",
    location: "Ernakulam",
    rating: 5,
    text: "Booked the Full Body Checkup package. The price was unbeatable — nearly 40% cheaper than what I paid elsewhere last year. Reports are detailed with clear normal ranges.",
    date: "1 month ago",
  },
  {
    name: "Anjali Nair",
    location: "Thrissur",
    rating: 5,
    text: "My elderly parents can't easily travel to a lab. Janseva's home collection has been a blessing. Very gentle and caring staff. Highly recommended!",
    date: "2 weeks ago",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Patient Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4E]">
            Loved by{" "}
            <span className="font-display italic font-normal text-[#2DB549]">
              thousands
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-border p-6 shadow-card flex flex-col gap-4"
            >
              <Stars count={t.rating} />
              <p className="text-slate-600 text-base leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-green-gradient flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">
                    {t.location} · {t.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-slate-500">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-semibold text-slate-700">4.9 out of 5</span>
          <span>·</span>
          <span>Based on 2,400+ Google reviews</span>
        </div>
      </div>
    </section>
  );
}
