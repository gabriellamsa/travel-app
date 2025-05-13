import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-[var(--nomadoo-primary)]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Travel Planning?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of travelers who are already using Nomadoo to plan
            their perfect trips. Start organizing your next adventure today!
          </p>
          <div className="flex justify-center">
            <button className="bg-white text-[var(--nomadoo-primary)] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 mt-6 text-sm">
            100% free. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
