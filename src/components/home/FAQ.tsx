"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does Nomadoo help me plan my trips?",
    answer:
      "Nomadoo provides a comprehensive platform where you can organize flights, accommodations, activities, and create detailed itineraries. Our intuitive interface makes it easy to keep all your travel plans in one place.",
  },
  {
    question: "Is Nomadoo free to use?",
    answer:
      "Yes! Nomadoo is completely free and includes all features to help you plan your travels with ease.",
  },
  {
    question: "Can I sync my bookings from other platforms?",
    answer:
      "Absolutely! Nomadoo allows you to import bookings from various travel services and booking platforms, making it easy to consolidate all your travel information.",
  },
  {
    question: "How does the map feature work?",
    answer:
      "Our interactive map feature lets you discover and save interesting places, create custom routes, and visualize your entire trip itinerary. You can also get real-time information about nearby attractions.",
  },
  {
    question: "Is my travel data secure?",
    answer:
      "Yes, we take data security seriously. All your travel information is encrypted and stored securely. We never share your personal data with third parties.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-[var(--nomadoo-primary)]">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Find answers to common questions about Nomadoo
        </p>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 flex justify-between items-center text-left"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
