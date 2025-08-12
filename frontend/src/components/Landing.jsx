// src/components/Landing.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Severity-aware Predictions",
    desc: "Enter mild or severe symptoms for better precision.",
    image: "img2.avif",
  },
  {
    title: "Rich Data Insights",
    desc: "Curated datasets with hundreds of diseases and symptom combinations.",
    image: "img3.svg",
  },
  {
    title: "Clean User Experience",
    desc: "Minimalist, responsive UI powered by React & Tailwind.",
    image: "img4.jpg",
  },
];

const faqs = [
  { question: "Is this tool a replacement for doctors?", answer: "No—it's a guide, not a substitute. Always consult professionals." },
  { question: "What data do you use?", answer: "Curated symptom-disease datasets with severity, risk factors, and precautions." },
  { question: "Is my data private?", answer: "It's processed locally; nothing is stored or shared." },
];

export default function Landing() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="text-gray-800 overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-pink-600 to-purple-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 backdrop-blur-sm bg-white/10 p-8 rounded-3xl shadow-xl">
            <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-5xl font-extrabold md:text-6xl">
              AI‑Powered Disease Prediction
            </motion.h1>
            <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-6 mb-8 max-w-xl text-lg md:text-xl text-gray-100">
              Enter symptoms with severity to instantly get likely conditions, precautions, risk factors, and medicine suggestions.
            </motion.p>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
              <Link to="/predict" className="inline-block rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow hover:bg-gray-100">
                Get Started →
              </Link>
            </motion.div>
          </div>
          <div className="flex-1 hidden md:block">
  <motion.img
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
    alt="Healthcare illustration"
    className="rounded-2xl shadow-lg border-4 border-white"
  />
</div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 320">

          <path fill="#ffffff" fillOpacity="1" d="M0,224L1440,32L1440,320L0,320Z"></path>
        </svg>
      </section>

      {/* About */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-pink to-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl pointer-events-none" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row">
          <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-1 bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-xl">
            <h2 className="text-5xl font-extrabold mb-6 text-gray-800">Why Choose Us?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Gain peace of mind with our smart, intuitive disease prediction tool—built on robust data and designed for seamless interactions.
            </p>
            <Link to="/predict" className="inline-block rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-blue-700">
              Try Now →
            </Link>
          </motion.div>
          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-1">
            <img src="/img1.jpg" alt="About illustration" className="rounded-2xl shadow-lg mx-auto max-w-lg" />
          </motion.div>
        </div>
      </section>

{/* Features */}
<section className="relative bg-gray-50 py-20 px-4 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-tr from-white to-blue-50 opacity-30 pointer-events-none"></div>
  <div className="relative z-10 mx-auto max-w-6xl">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12 text-4xl font-bold text-center"
    >
      Features
    </motion.h2>
    <div className="grid gap-10 md:grid-cols-3">
      {features.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
          whileHover={{ scale: 1.03, boxShadow: "0 20px 25px rgba(0,0,0,0.1)" }}
          className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/20 transition"
        >
          <div className="w-full overflow-hidden rounded-2xl shadow-lg">
            <img src={f.image} alt={f.title} className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <h3 className="mt-4 mb-2 text-xl font-semibold text-gray-800">{f.title}</h3>
          <p className="text-gray-700">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* FAQ */}
      <section className="relative py-20 px-4 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl space-y-6">
          <h2 className="mb-10 text-4xl font-bold text-center">FAQs</h2>
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} onClick={() => setExpanded(expanded === i ? null : i)} className="cursor-pointer">
              <div className="flex items-center justify-between rounded-3xl bg-white/50 backdrop-blur-md p-6 shadow border border-white/20">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <motion.span animate={{ rotate: expanded === i ? 45 : 0 }} transition={{ duration: 0.3 }} className="text-blue-600 text-2xl font-bold">+</motion.span>
              </div>
              <motion.div initial={{ height: 0 }} animate={{ height: expanded === i ? "auto" : 0 }} className="overflow-hidden bg-white/40 backdrop-blur-md px-6">
                <p className="py-4 text-gray-700">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
