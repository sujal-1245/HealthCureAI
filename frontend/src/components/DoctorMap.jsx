// src/components/DoctorMap.jsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Listbox } from "@headlessui/react";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { useSpring, animated } from "react-spring";

const SPECIALIZATIONS = [
  "All",
  "General Practitioner",
  "Dermatologist",          // skin issues: fungal infection, psoriasis, acne, impetigo
  "Allergist",              // allergy
  "Gastroenterologist",     // GERD, peptic ulcer, gastroenteritis, hepatitis
  "Hepatologist",           // chronic cholestasis, various hepatitis
  "Infectious Disease Specialist", // AIDS, malaria, tuberculosis, dengue, typhoid, etc.
  "Endocrinologist",        // diabetes, hypothyroidism, hypoglycemia
  "Pulmonologist",          // bronchial asthma, pneumonia, tuberculosis
  "Cardiologist",           // hypertension, heart attack
  "Neurologist",            // migraine, vertigo, paralysis
  "Orthopedic",             // cervical spondylosis, osteoarthritis, arthritis
  "Pediatrician",           // chicken pox, common childhood infectious diseases
  "Urologist",              // urinary tract infection
  "Rheumatologist",         // arthritis, psoriasis with joint involvement
  "ENT",                    // common cold, sinus issues
  "Hematologist",           // anemia, blood-related disorders (applicable in some infections)
  "Proctologist",           // hemorrhoids (piles)
  "Vascular Surgeon"        // varicose veins
];


export default function DoctorMap() {
  const mapRef = useRef();
  const mapInstance = useRef();
  const [doctorMarkers, setDoctorMarkers] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [loading, setLoading] = useState(false);

   const fade = useSpring({ opacity: topDoctors.length ? 1 : 0, transform: topDoctors.length ? 'translateY(0)' : 'translateY(-20px)' });

  const defaultView = [20.5937, 78.9629];

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      const map = L.map(mapRef.current).setView(defaultView, 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© HealthCureAI",
        maxZoom: 19,
      }).addTo(map);
      mapInstance.current = map;

      map
        .locate({ setView: true, maxZoom: 13 })
        .on("locationfound", (e) => searchDoctors(e.latlng.lat, e.latlng.lng))
        .on("locationerror", () => {});
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Enter" && handleSetLocation();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [city, specialty]);

  const handleSetLocation = async () => {
    if (!city.trim()) return alert("Enter city or ZIP.");
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          city
        )}`
      );
      const data = await res.json();
      if (!data.length) throw new Error("Location not found.");

      const lat = parseFloat(data[0].lat),
        lon = parseFloat(data[0].lon);

      mapInstance.current.flyTo([lat, lon], 13, {
        animate: true,
        duration: 1.3,
      });
      clearMarkers();
      searchDoctors(lat, lon);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const searchDoctors = async (lat, lon) => {
    const radii = [5000, 10000, 20000];
    for (let radius of radii) {
      try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: `[out:json];
            node["healthcare"="doctor"](around:${radius},${lat},${lon});
            out body;`,
        });
        const data = await res.json();
        const docs = data.elements || [];
        if (!docs.length) {
          if (radius === radii[radii.length - 1]) {
            alert("No doctors found within 20 km.");
            setLoading(false);
          }
          continue;
        }
        addMarkersAndUpdate(lat, lon, docs);
        return;
      } catch {
        alert("Error fetching doctors.");
        setLoading(false);
        return;
      }
    }
  };

  const addMarkersAndUpdate = (lat, lon, docs) => {
    clearMarkers();
    const filtered = docs.filter((doc) => {
      const spec = doc.tags.specialty || doc.tags["healthcare:speciality"] || "General Practitioner";
      return specialty === "All" || spec.toLowerCase().includes(specialty.toLowerCase());
    });

    if (!filtered.length) {
      alert(`No doctors with specialization "${specialty}" in range. Showing all.`);
      // keep original docs
    }

    const useDocs = filtered.length ? filtered : docs;

    const markers = useDocs
      .map((doc) => {
        if (!doc.lat || !doc.lon) return null;
        const name = doc.tags.name || "Unknown";
        const spec = doc.tags.specialty || doc.tags["healthcare:speciality"] || "General Practitioner";
        const clinic = doc.tags["healthcare:speciality"] || "Clinic";
        const dist = calculateDistance(lat, lon, doc.lat, doc.lon).toFixed(1);
        const rating = [3.8, 4, 4.2, 4.5, 4.7, 4.9][Math.floor(Math.random() * 6)];
        const marker = L.marker([doc.lat, doc.lon], {
          icon: L.icon({
            iconUrl:
              "https://maps.google.com/mapfiles/ms/icons/" +
              (rating >= 4.5 ? "green" : rating >= 4 ? "yellow" : "red") +
              "-dot.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          }),
        })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="min-width:200px">
              <strong>${name}</strong><br>
              🩺 <em>${spec}</em><br>
              🏥 ${clinic}<br>
              ⭐ <b>${rating}</b> | 📍 ${dist} km
            </div>`);
        return { marker, info: { name, spec, clinic, rating, dist } };
      })
      .filter(Boolean);

    setDoctorMarkers(markers.map((m) => m.marker));
    setTopDoctors(markers.slice(0, 5).map((m) => m.info));

    const group = L.featureGroup(markers.map((m) => m.marker));
    setTimeout(() => {
      mapInstance.current.invalidateSize();
      mapInstance.current.fitBounds(group.getBounds().pad(0.3));
      setLoading(false);
    }, 300);
  };

  const clearMarkers = () => {
    doctorMarkers.forEach((m) => mapInstance.current.removeLayer(m));
    setDoctorMarkers([]);
    setTopDoctors([]);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1),
      dLon = toRad(lon2 - lon1),
      R = 6371;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return (
    <div className="mx-auto max-w-4xl p-6 mt-10 rounded-2xl shadow-xl backdrop-blur-md bg-gradient-to-br from-white/40 to-white/20 border border-white/30"
>
        <div className="mx-auto max-w-xl p-6 bg-white rounded-2xl shadow-xl mt-10 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Find Nearby Doctors</h2>
        <p className="text-gray-500">Search by city/ZIP and choose specialization</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={city} placeholder="City or ZIP"
            onChange={e => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-blue-500 focus:ring-blue-200 transition"
          />
        </div>

        <Listbox value={specialty} onChange={setSpecialty}>
          <div className="relative w-full sm:w-60">
            <Listbox.Button className="w-full flex justify-between px-4 py-2 border rounded-lg focus:border-blue-500 focus:ring-blue-200 transition">
              {specialty}
              <span className="ml-2 text-gray-400">▾</span>
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto z-10">
              {SPECIALIZATIONS.map(opt => (
                <Listbox.Option key={opt} value={opt} className={({ active }) => `px-4 py-2 cursor-pointer ${active ? 'bg-blue-100' : ''}`}>
                  {opt}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <button
          onClick={handleSetLocation}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <FiSearch />
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      <animated.div style={fade}>
        {topDoctors.length > 0 && (
          <div className="bg-gradient-to-b from-blue-500/90 to-blue-600/20 p-4 rounded-lg shadow-inner">
            <h3 className="font-bold text-white text-center justify-center mb-2">Top Matches</h3>
            <ul className="space-y-2">
  {topDoctors.map((d, i) => (
    <li key={i} className="flex justify-between">
      <span className="flex-1"><strong>{d.name}</strong> – {d.spec}</span>
      <span className="text-gray-600 text-right">⭐ {d.rating} · {d.dist} km</span>
    </li>
  ))}
</ul>

          </div>
        )}
      </animated.div>

      <div
        ref={mapRef}
        className="w-full h-96 rounded-2xl border border-gray-200 shadow hover:shadow-2xl transition"
      />
    </div>
    </div>
  );
}
