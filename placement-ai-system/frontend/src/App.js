import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentSearch from "./pages/StudentSearch";
import Prediction from "./pages/Prediction";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/students" element={<StudentSearch />} />
        <Route path="/prediction" element={<Prediction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;