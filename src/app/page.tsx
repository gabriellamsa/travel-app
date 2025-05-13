import Hero from "@/src/components/home/Hero";
import Features from "@/src/components/home/Features";
import FAQ from "@/src/components/home/FAQ";
import CTA from "@/src/components/home/CTA";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Features />
      <FAQ />
      <CTA />
    </div>
  );
}
