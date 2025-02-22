import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import LessonPlanner from "./pages/LessonPlanner";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/planner" /> : <Login setAuth={setIsAuthenticated} />}
      />
      <Route
        path="/planner"
        element={isAuthenticated ? <LessonPlanner /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
