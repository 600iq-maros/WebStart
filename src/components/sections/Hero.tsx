"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const handleCTA = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector("#kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="domov"
      className="min-h-screen flex items-center justify-center px-4 pt-20"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          Vytvoríme vám web,{" "}
          <span className="text-blue-600 dark:text-blue-400">
            ktorý predáva
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Rýchle, moderné a cenovo dostupné webové stránky. Od návrhu po
          spustenie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10"
        >
          <a
            href="#kontakt"
            onClick={handleCTA}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-medium transition-colors"
          >
            Mám záujem
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
