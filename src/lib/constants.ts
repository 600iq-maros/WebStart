export const NAV_LINKS = [
  { label: "Domov", href: "#domov" },
  { label: "Cenník", href: "#cennik" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Kontakt", href: "#kontakt" },
];

export const PRICING_TIERS = [
  {
    name: "Basic",
    price: 200,
    popular: false,
    features: [
      "Základný portfólio dizajn",
      "Cenníková sekcia",
      "Kontaktné údaje",
      "1 kontaktný formulár",
      "Responzívny dizajn",
    ],
  },
  {
    name: "Pro",
    price: 300,
    popular: true,
    features: [
      "Všetko z Basic balíka",
      "WhatsApp tlačidlo",
      "Až 3 formuláre",
      "Animácie a efekty",
      "SEO optimalizácia",
      "Prioritná podpora",
    ],
  },
];

export const CALCULATOR_ADDON = {
  name: "Kalkulačka",
  price: 50,
  description: "Vlastná kalkulačka pre váš web (+50€ za každú)",
};

export const CONTACT_INFO = {
  email: "info@webstart.sk",
  phone: "+421 900 000 000",
  whatsapp: "https://wa.me/421900000000",
};

export const SOCIAL_LINKS = [
  { name: "Facebook", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "LinkedIn", href: "#" },
];

export const PORTFOLIO_PROJECTS = [
  { title: "E-shop Módne Kúsky", category: "E-commerce", gradient: "from-blue-500 to-cyan-500" },
  { title: "Reštaurácia Gusto", category: "Gastro", gradient: "from-orange-500 to-red-500" },
  { title: "Fitness Studio Flex", category: "Šport", gradient: "from-green-500 to-emerald-500" },
  { title: "Advokátska kancelária", category: "Služby", gradient: "from-purple-500 to-indigo-500" },
  { title: "Kvetinárstvo Rosa", category: "Retail", gradient: "from-pink-500 to-rose-500" },
  { title: "Tech Startup MVP", category: "Technológie", gradient: "from-violet-500 to-blue-500" },
];
