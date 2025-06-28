// src/components/SymptomSearch.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function SymptomSearch({ symptoms = [], onAdd }) {
  const [query, setQuery] = useState("");
  const filtered = symptoms.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search symptom..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full px-4 py-2 bg-white bg-opacity-60 backdrop-blur-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {query && filtered.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 bg-white bg-opacity-90 backdrop-blur-md border border-gray-300 rounded-b-lg shadow-lg z-10"
        >
          {filtered.map((s, i) => (
            <li
              key={i}
              onClick={() => { onAdd(s); setQuery(""); }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
            >
              {s}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
