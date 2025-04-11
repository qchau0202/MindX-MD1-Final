import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header/>
        <h1 className="text-3xl font-bold text-center py-8">
          Welcome to EduPress main page
        </h1>
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
