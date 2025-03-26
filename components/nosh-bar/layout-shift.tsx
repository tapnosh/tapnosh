"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function MorphButtonModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            layoutId="morph"
            onClick={() => setIsOpen(true)}
            style={{
              width: "120px",
              height: "40px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "var(--primary)",
            }}
            className="text-primary-foreground mx-auto mt-12"
            transition={{
              layout: { duration: 0.8, type: "spring", damping: 16 },
            }}
          >
            <motion.div layoutId="motion-button">Open Modal</motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="morph"
            style={{
              width: "calc(100vw - 2rem)",
              height: "calc(100vh - 2rem)",
              borderRadius: "10px",
              position: "fixed",
              inset: "1rem",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
              zIndex: 60,
              backgroundColor: "var(--background)",
            }}
            transition={{
              layout: { duration: 0.8, type: "spring", damping: 16 },
            }}
          >
            <motion.button
              layoutId="motion-button"
              onClick={() => setIsOpen(false)}
            >
              Close Modal
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
