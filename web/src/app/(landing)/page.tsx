import BentoFeatures from "@/components/common/landing/BentoFeatures";
import FaqSection from "@/components/common/landing/FaqSection";
import HeroSection from "@/components/common/landing/HeroSection";
import HowItWorks from "@/components/common/landing/HowItWorks";
import LandingFooter from "@/components/common/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <HeroSection />
      <BentoFeatures />
      <HowItWorks />
      <FaqSection />
      <LandingFooter />
    </main>
  );
}
