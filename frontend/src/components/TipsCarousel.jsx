// src/components/TipsCarousel.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tips = [
  "Stay hydrated – drink at least 8 glasses daily.",
  "Wash hands frequently to prevent infections.",
  "Get 7–8 hours of sleep for immune health.",
  "Eat fruits & veggies for essential vitamins.",
];

export default function TipsCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-white bg-opacity-70 backdrop-blur rounded-xl shadow-lg mb-8">
      <AnimatePresence exitBeforeEnter>
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center text-gray-800 font-medium"
        >
          {tips[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
