"use client";

import { useState } from "react";
import { Send, Mail, Phone } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_INFO } from "@/lib/constants";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${CONTACT_INFO.email}?subject=Nová správa od ${formData.name}&body=${encodeURIComponent(formData.message)}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses =
    "w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <section id="kontakt" className="py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeading
            title="Kontakt"
            subtitle="Napíšte nám a ozveme sa do 24 hodín"
          />
        </AnimatedSection>

        <div className="mt-16 grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Meno
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vaše meno"
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vas@email.sk"
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Správa
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Popíšte nám váš projekt..."
                  className={inputClasses + " resize-none"}
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Odoslať správu
                <Send size={18} />
              </button>
            </form>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Kontaktné údaje
                </h3>
                <div className="space-y-4">
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <Mail
                      size={20}
                      className="text-blue-600 dark:text-blue-400 shrink-0"
                    />
                    {CONTACT_INFO.email}
                  </a>
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <Phone
                      size={20}
                      className="text-blue-600 dark:text-blue-400 shrink-0"
                    />
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Pracovná doba</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Pondelok - Piatok: 9:00 - 17:00
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Víkend: Na základe dohody
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
