import Hero from "@/components/landing/Hero";
import FeaturedTests from "@/components/landing/FeaturedTests";
import HowItWorks from "@/components/landing/HowItWorks";
import HealthPackages from "@/components/landing/HealthPackages";
import WhyJanseva from "@/components/landing/WhyJanseva";
import CoverageChecker from "@/components/landing/CoverageChecker";
import Testimonials from "@/components/landing/Testimonials";
import CtaBanner from "@/components/landing/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedTests />
      <HowItWorks />
      <HealthPackages />
      <WhyJanseva />
      <CoverageChecker />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
