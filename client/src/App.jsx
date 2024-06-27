import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Teacher from "./components/Teacher";
import Student from "./components/Student";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/student" element={<Student />} />
          <Route path="/" element={<Teacher />} />
          {/* Default route to Teacher for simplicity */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
