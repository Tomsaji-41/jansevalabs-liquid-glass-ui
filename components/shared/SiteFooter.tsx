import Link from "next/link";
import {
  FlaskConical,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  MessageCircle,
} from "lucide-react";

const footerLinks = {
  tests: [
    { label: "Blood Tests", href: "/tests?category=blood" },
    { label: "Hormone Tests", href: "/tests?category=hormone" },
    { label: "Urine Tests", href: "/tests?category=urine" },
    { label: "Health Packages", href: "/packages" },
    { label: "Full Body Checkup", href: "/packages/full-body-checkup" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ],
  patient: [
    { label: "Patient Portal", href: "/patient/dashboard" },
    { label: "View Results", href: "/results" },
    { label: "Book a Test", href: "/book" },
    { label: "Track Order", href: "/results" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-[#0B1F4E] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-gradient flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-display italic text-xl text-white">
                  Janseva
                </span>
                <span className="block text-[10px] font-semibold tracking-widest text-[#2DD4BF] uppercase -mt-0.5">
                  Diagnostics
                </span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              NABL-accredited diagnostic laboratory providing accurate,
              affordable tests with home sample collection across your city.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-md/10 hover:bg-[#0D9488] flex items-center justify-center transition-colors"
                aria-label="Social"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 backdrop-blur-md/10 hover:bg-[#0D9488] flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tests */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase text-[#2DD4BF] mb-4">
              Tests & Packages
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.tests.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase text-[#2DD4BF] mb-4">
              Patient Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.patient.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase text-[#2DD4BF] mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/50">
                <Phone className="w-4 h-4 mt-0.5 text-[#2DD4BF] shrink-0" />
                <span>1800-000-0000 (Toll Free)</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/50">
                <Mail className="w-4 h-4 mt-0.5 text-[#2DD4BF] shrink-0" />
                <span>support@janseva.in</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/50">
                <MapPin className="w-4 h-4 mt-0.5 text-[#2DD4BF] shrink-0" />
                <span>123 Medical Centre, Sector 5, Your City</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/50">
                <Clock className="w-4 h-4 mt-0.5 text-[#2DD4BF] shrink-0" />
                <span>Mon–Sat: 6 AM – 8 PM<br />Sun: 7 AM – 3 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Janseva Diagnostics. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
