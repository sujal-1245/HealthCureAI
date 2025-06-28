// src/components/Disease.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTrashAlt, FaPlus, FaHeartbeat, FaBrain, FaRobot, FaStethoscope } from "react-icons/fa";
import Loader from "./Loader";
import TipsCarousel from "./TipsCarousel";
import OnboardingModal from "./OnboardingModal";
import DoctorMap from "./DoctorMap";

const BACKEND_URL = "https://healthcureai.onrender.com";

function SideDecor() {
  const icons = [
    { icon: FaHeartbeat, side: "left", offset: "15%", delay: 0 },
    { icon: FaStethoscope, side: "right", offset: "15%", delay: 1.5 },
  ];

  return (
    <div className="hidden md:block scale-200 absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ icon: Icon, side, offset, delay }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 5.2, 0],
            y: [0, 20, 0],
          }}
          transition={{ repeat: Infinity, duration: 4, delay }}
          className="absolute text-green-300 text-7xl"
          style={{
            [side]: "5rem",
            top: offset,
          }}
        >
          <Icon />
        </motion.div>
      ))}
    </div>
  );
}

export default function Disease() {
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/symptoms`)
      .then((res) => setSymptoms(res.data.symptoms))
      .catch(console.error);
  }, []);

  const add = () => setSelected([...selected, { symptom: "", severity: 1 }]);
  const update = (i, key, v) => {
    const arr = [...selected];
    arr[i][key] = v;
    setSelected(arr);
  };
  const remove = (i) => setSelected(selected.filter((_, idx) => idx !== i));

  const submit = () => {
    const valid = selected.filter((s) => s.symptom);
    if (!valid.length) return alert("Select at least one symptom.");
    axios
      .post(`${BACKEND_URL}/predict`, { symptoms: valid })
      .then((r) => setPrediction(r.data))
      .catch((e) => {
        console.error(e);
        alert("Backend error.");
      });
  };

  return (
    <div className="relative overflow-hidden">
      <SideDecor />
      <div className="mt-0 bg-gradient-to-br from-blue-500 to-blue-100 ">
        <div className="relative py-16 px-4 min-h-screen overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/4 -translate-y-1/4 w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-2xl"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-xl mx-auto bg-white bg-opacity-40 backdrop-blur-lg border border-white/30 p-8 rounded-3xl shadow-2xl z-10"
          >
            <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
              🧬 Disease Predictor
            </h1>

            {selected.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 mb-4"
              >
                <select
                  className="flex-1 px-4 py-2 bg-white bg-opacity-60 backdrop-blur-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  value={s.symptom}
                  onChange={(e) => update(i, "symptom", e.target.value)}
                >
                  <option value="">Select Symptom</option>
                  {symptoms.map((sym, idx) => (
                    <option key={idx} value={sym}>
                      {sym}
                    </option>
                  ))}
                </select>

                <select
                  className="w-28 px-3 py-2 bg-white bg-opacity-60 backdrop-blur-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={s.severity}
                  onChange={(e) => update(i, "severity", +e.target.value)}
                >
                  <option value={1}>Mild</option>
                  <option value={2}>Severe</option>
                </select>

                <button
                  onClick={() => remove(i)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FaTrashAlt size={18} />
                </button>
              </motion.div>
            ))}

            <div className="flex justify-between items-center mb-6">
              <button
                onClick={add}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition"
              >
                <FaPlus /> Add Symptom
              </button>
              <motion.button
                onClick={submit}
                whileHover={{ scale: 1.05 }}
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
              >
                Predict
              </motion.button>
            </div>

            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl border border-white/40 shadow-2xl space-y-6"
              >
                {prediction.predicted_disease ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🩺</div>
                      <h2 className="text-3xl font-bold text-green-700">
                        {prediction.predicted_disease}
                      </h2>
                    </div>

                    <div className="flex items-center justify-between text-gray-700">
                      <span>Matched Symptoms</span>
                      <span className="text-lg font-semibold">
                        {prediction.matched_score} / {prediction.total_symptoms_considered}
                      </span>
                    </div>

                    {prediction.matched_symptoms?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">
                          ✅ Matched Symptoms
                        </h3>
                        <ul className="flex flex-wrap gap-2">
                          {prediction.matched_symptoms.map((sym, i) => (
                            <li
                              key={i}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm shadow-sm"
                            >
                              {sym}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {prediction.precautions?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-orange-700 mb-2">
                          ⚠️ Precautions
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {prediction.precautions.map((p, i) => (
                            <li
                              key={i}
                              className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 text-gray-800"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {prediction.risk_factors?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-red-700 mb-2">
                          🚨 Risk Factors
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {prediction.risk_factors.map((r, i) => (
                            <li
                              key={i}
                              className="bg-red-50 px-4 py-2 rounded-lg border border-red-200 text-gray-800"
                            >
                              {r}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {prediction.medicines?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-purple-700 mb-4">
                          💊 Recommended Medicines
                        </h3>
                        <div className="space-y-4">
                          {prediction.medicines.map((m, i) => (
                            <div
                              key={i}
                              className="p-4 bg-purple-50 border border-purple-200 rounded-xl shadow-sm"
                            >
                              <div className="font-semibold text-purple-800 text-md">
                                {m.name}
                              </div>
                              <div className="text-sm text-gray-700">
                                {m.composition}
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{m.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  <p className="text-red-600 font-semibold">No match found.</p>
                )}
              </motion.div>
            )}
          </motion.div>
          <OnboardingModal />
          <div className="mt-5">
            <TipsCarousel />
          </div>
        </div>
        <DoctorMap />
      </div>
    </div>
  );
}
