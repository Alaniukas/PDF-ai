import { Hero } from "@/components/landing/Hero";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { ScrollHint } from "@/components/landing/ScrollHint";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ForWhom } from "@/components/landing/ForWhom";
import { AboutUs } from "@/components/landing/AboutUs";
import { PricingSection } from "@/components/landing/PricingSection";
import { PdfPreviewSection } from "@/components/landing/PdfPreviewSection";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <ScrollHint />
      <Hero />
      <TestimonialsMarquee />
      <PdfPreviewSection />
      <Problem />
      <HowItWorks />
      <ForWhom />
      <AboutUs />
      <PricingSection />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
