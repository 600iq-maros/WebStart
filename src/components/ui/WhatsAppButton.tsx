"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { CONTACT_INFO } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <motion.a
      href={CONTACT_INFO.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Kontaktujte nás cez WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
