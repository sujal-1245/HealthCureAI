# 💼 Resume Editor

A modern, web-based Resume Editor built with *React + FastAPI*  
✨ Enhance sections with mock AI  
📄 Upload + Edit your resume  
💾 Save and ⬇ Download as JSON  
🚀 Styled beautifully with Roboto + Clean UI

---

## 📁 Folder Structure

resume-editor/
├── backend/ # FastAPI app
│ └── main.py
├── frontend/ # React app (Vite)
│ └── src/
│ ├── App.jsx
│ └── App.css
└── README.md

---

## ⚙ How to Run

### ✅ Backend (FastAPI)

```bash
cd backend/backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs at: http://localhost:8000

✅ Frontend (React + Vite)

cd frontend
npm install
npm run dev
# Runs at: http://localhost:5173 
```
✨ Features
📄 Upload fake .pdf or .docx and parse content (mocked)

📝 Edit resume fields (name, summary, experience, etc.)

🧠 Enhance sections using mock AI (via FastAPI)

💾 Save resume JSON to backend

⬇ Download final resume as .json

🎨 Clean and responsive design

📸 Screenshots
![image](https://github.com/user-attachments/assets/3f990cc3-b0a9-421e-bca7-4b825407a5e5)


🚀 Future Improvements
📄 Export to PDF

🔔 Toast Notifications

🎨 Multiple Templates

🤖 Real AI integration (OpenAI API)

Made with 💖
