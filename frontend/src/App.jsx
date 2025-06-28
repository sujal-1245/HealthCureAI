import { Routes, Route, Link } from 'react-router-dom';
import Landing from './components/Landing';
import Disease from './components/Disease';

function App() {
  return (
  <div className="min-h-screen flex flex-col">
    <nav className="bg-white shadow-md mb-0 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
        >
          HealthCureAI
        </Link>
        <div className="space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/predict"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Predict
          </Link>
        </div>
      </div>
    </nav>

    <div className="flex-grow pt-20">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/predict" element={<Disease />} />
      </Routes>
    </div>

    <footer className="mt-auto bg-gray-900 text-gray-300 p-6 text-center">
      © {new Date().getFullYear()} Disease Predictor. Built with ❤️ by Sujal Bhagat
    </footer>
  </div>
);

}

export default App;
