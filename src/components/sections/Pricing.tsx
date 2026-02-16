"use client";

import { Check, Plus } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRICING_TIERS, CALCULATOR_ADDON } from "@/lib/constants";

export function Pricing() {
  return (
    <section id="cennik" className="py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeading
            title="Cenník"
            subtitle="Transparentné ceny bez skrytých poplatkov"
          />
        </AnimatedSection>

        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_TIERS.map((tier, index) => (
            <AnimatedSection key={tier.name} delay={index * 0.15}>
              <div
                className={`relative p-8 rounded-2xl border h-full ${
                  tier.popular
                    ? "border-blue-600 dark:border-blue-400 shadow-lg shadow-blue-600/10"
                    : "border-gray-200 dark:border-gray-800"
                } bg-white dark:bg-gray-950`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm rounded-full font-medium">
                    Najobľúbenejší
                  </span>
                )}
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}€</span>
                </p>
                <ul className="mt-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check
                        size={18}
                        className="text-blue-600 dark:text-blue-400 shrink-0"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontakt"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#kontakt")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`mt-8 block text-center py-3 rounded-lg font-medium transition-colors ${
                    tier.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  Mám záujem
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="mt-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-950">
            <div className="flex items-center gap-3">
              <Plus
                size={20}
                className="text-blue-600 dark:text-blue-400 shrink-0"
              />
              <div>
                <p className="font-semibold">{CALCULATOR_ADDON.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {CALCULATOR_ADDON.description}
                </p>
              </div>
            </div>
            <span className="text-xl font-bold whitespace-nowrap">
              +{CALCULATOR_ADDON.price}€
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
