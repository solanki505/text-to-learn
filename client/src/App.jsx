import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";

export default function App() {
  return (
    <Routes>
      <Route path="/"              element={<Home />} />
      <Route path="/course/:id"    element={<CoursePage />} />
      <Route path="/lesson/:id"    element={<LessonPage />} />
    </Routes>
  );
}
