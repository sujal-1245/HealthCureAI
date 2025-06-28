// src/components/OnboardingModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl max-w-lg text-center shadow-xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p className="text-gray-700 mb-6">
              Enter symptoms, choose severity, and click Predict. You’ll get likely conditions, precautions, risk factors, and suggested medicines. Let’s get you started!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
            >
              Got It!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
