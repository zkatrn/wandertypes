"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionSection({ title, children, defaultOpen = false }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-6 py-5 bg-stone-50/95 border-stone-200 text-left font-medium
          flex items-center justify-between hover:bg-stone-100/95 transition-colors
          ${isOpen ? 'rounded-t-lg border-b' : 'rounded-lg'}
        `}
      >
        <span className="text-stone-900 tracking-wide">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg text-stone-500"
        >
          ▾
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-stone-50/95 border-t border-stone-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}