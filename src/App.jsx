import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import QuestionnairePage from "./pages/Questionnaire/QuestionnairePage";
import AvatarGame from "./pages/Questionnaire/AvatarGame";
import ResultsPage from "./pages/Questionnaire/ResultsPage";
import AboutUsPage from "./pages/About";
import OptionsInstructionsPage from "./pages/Questionnaire/OptionsInstructionsPage";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/avatar-game" element={<AvatarGame />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route
            path="/instructions-options"
            element={<OptionsInstructionsPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
