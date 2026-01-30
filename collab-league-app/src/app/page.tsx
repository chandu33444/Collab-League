import {
  Navbar,
  HeroSection,
  HowItWorks,
  FeaturesGrid,
  TestimonialsCarousel,
  PricingSection,
  FAQAccordion,
  Footer
} from '@/components/landing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturesGrid />
        <TestimonialsCarousel />
        <PricingSection />
        <FAQAccordion />
      </main>
      <Footer />
    </div>
  );
}
