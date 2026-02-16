"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PORTFOLIO_PROJECTS } from "@/lib/constants";

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="py-20 sm:py-28 px-4 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeading
            title="Naše Práce"
            subtitle="Ukážky našich posledných projektov"
          />
        </AnimatedSection>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <AnimatedSection key={project.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
              >
                <div
                  className={`aspect-video bg-gradient-to-br ${project.gradient} relative`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium">
                        Navštíviť web
                        <ExternalLink size={14} />
                      </span>
                    </motion.div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">
                    {project.category}
                  </p>
                  <h3 className="mt-1 font-semibold">{project.title}</h3>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
