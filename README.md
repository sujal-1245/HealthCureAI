<!-- PROJECT LOGO -->
<p align="center">
  <img width="290" height="174" alt="image" src="https://github.com/user-attachments/assets/4b84439b-589e-4018-9d9a-e53ffb975d0a" />

</p>


<h1 align="center">💊 HealthCureAI</h1>
<p align="center">
  <em>An AI-powered health assistant that predicts diseases, suggests precautions, and helps locate nearby doctors — all in one elegant interface.</em>
</p>

<p align="center">
  <a href="https://healthcureai.vercel.app"><strong>🌐 Live Demo »</strong></a> •
  <a href="#features">Features</a> •
  <a href="#getting-started">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributing">Contribute</a> •
  <a href="#contact">Contact</a>
</p>

---

<!-- BADGES -->
<p align="center">
  <img src="https://img.shields.io/github/license/sujal-1245/HealthCureAI?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/stars/sujal-1245/HealthCureAI?style=flat-square" alt="Stars">
  <img src="https://img.shields.io/github/forks/sujal-1245/HealthCureAI?style=flat-square" alt="Forks">
  <img src="https://img.shields.io/badge/Framework-React%20%2B%20FastAPI-blue?style=flat-square" alt="Frameworks">
  <img src="https://img.shields.io/badge/Style-Tailwind%20CSS%20%7C%20Framer%20Motion-00bcd4?style=flat-square" alt="Style">
</p>

---

## 🩺 Overview  
**HealthCureAI** merges machine learning with modern web design to make healthcare predictions more accessible and reliable.  
It allows users to:
- Input symptoms to predict possible diseases with probability scores  
- View risk factors, precautions, and suggested over-the-counter medicines  
- Find nearby doctors or specialists via an interactive map  
- Enjoy a smooth, animated, responsive interface

---

## 🧱 Architecture & Tech Stack  

**Frontend**
- ⚛️ React — Modern component-based UI  
- 🎨 Tailwind CSS — Clean, responsive design  
- 🎞 Framer Motion — Seamless animations  
- 🗺️ Map API — Locate nearby doctors  

**Backend**
- 🚀 FastAPI — High-performance REST backend  
- 🤖 ML Model — Trained for disease prediction  
- 🧩 Python libraries — scikit-learn / TensorFlow (as applicable)

**Deployment**
- 🖥 Frontend — Deployed via Vercel  
- ☁️ Backend — FastAPI hosted on cloud (Heroku / Render / AWS etc.)
- 🔐 Environment variables stored securely  

---

## 📂 Folder Structure  
```

HealthCureAI/
├── frontend/             # React + Tailwind + FramerMotion UI
│   ├── src/
│   └── public/
├── backend/              # FastAPI server + ML logic
│   ├── main.py
│   └── model/
├── assets/               # Logo, demo GIFs, screenshots
└── README.md

````

---

## ⚙️ Getting Started  

### Prerequisites  
Ensure you have:
- Node.js (v18+)  
- Python (3.9+)  
- A Map API key (Google Maps / Leaflet / OpenStreetMap)

### Installation  

1. **Clone the repository**
   ```bash
   git clone https://github.com/sujal-1245/HealthCureAI.git
   cd HealthCureAI


2. **Backend setup**

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Frontend setup**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Visit `http://localhost:5173` (or your Vite port).

---

## 🧾 .env Example

Create a `.env` file in both frontend & backend directories:

### Frontend `.env`

```
VITE_API_BASE_URL=http://localhost:8000
VITE_MAP_API_KEY=YOUR_MAP_API_KEY
```

### Backend `.env`

```
MODEL_PATH=models/disease_model.pkl
MAP_API_KEY=YOUR_MAP_API_KEY
```

---

## 💡 Usage

1. **Enter Symptoms**
   Select symptoms from a list and assign severity.

2. **AI Prediction**
   The model predicts potential diseases and shows probabilities.

3. **Recommendations**
   View precautions, common medicines, and lifestyle advice.

4. **Find Doctors Nearby**
   The app locates specialists within your area using the integrated map.

> Example:
> Input — *fever, headache, fatigue*
> Output — *Predicted: Dengue (87%), Typhoid (72%)*
>
> Suggestions — Stay hydrated, paracetamol 500 mg, consult physician if fever persists.

---

## 🖼️ Screenshots & Demo

<p align="center">
  <img src="assets/demo.gif" alt="App Demo" width="700"><br>
  <em>Interactive demo showing prediction flow and map feature.</em>
</p>

| Home Page                   | Prediction Result             | Doctor Locator             |
| --------------------------- | ----------------------------- | -------------------------- |
| ![Home](assets/screen1.png) | ![Result](assets/screen2.png) | ![Map](assets/screen3.png) |

---

## 🆕 Future Enhancements

* 🧍‍♂️ User login & saved prediction history
* 💬 AI chatbot for quick health Q&A
* 🌍 Multi-language support
* 📱 Mobile app with Flutter
* 🔔 Health alerts & reminders

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:

   ```bash
   git checkout -b feature/awesome-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch and open a pull request

Please follow consistent naming and comment style.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

👤 **Maintainer:** [@sujal-1245](https://github.com/sujal-1245)
📫 **Email:** [sujalbhagat1245@gmail.com](mailto:sujalbhagat1245@gmail.com)
🌐 **Live Demo:** [healthcureai.vercel.app](https://healthcureai.vercel.app)

---

<p align="center">
  <strong>“An ounce of prevention is worth a pound of cure.”</strong>  
  <br>Made with ❤️ by Sujal Bhagat
</p>
```
