"use client";

import { Facebook, Instagram, Linkedin } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Facebook: <Facebook size={20} />,
  Instagram: <Instagram size={20} />,
  LinkedIn: <Linkedin size={20} />,
};

export function Footer() {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold">WebStart</span>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Moderné webové stránky pre váš biznis.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Navigácia</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Sociálne siete</h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={link.name}
                >
                  {SOCIAL_ICONS[link.name]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} WebStart. Všetky práva vyhradené.
        </div>
      </div>
    </footer>
  );
}
