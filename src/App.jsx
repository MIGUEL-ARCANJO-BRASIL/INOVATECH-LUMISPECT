import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import QuestionnairePage from "./pages/Questionnaire/QuestionnairePage";
import ResultsPage from "./pages/Questionnaire/ResultsPage";
import AboutUsPage from "./pages/About";
import OptionsInstructionsPage from "./pages/Questionnaire/OptionsInstructionsPage";
import ScrollToTop from "./components/UI/ScrollToTop";
import AnimatedLayout from "./components/UI/AnimetedLayout";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Header />

        <Routes>
          <Route element={<AnimatedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route
              path="/instructions-options"
              element={<OptionsInstructionsPage />}
            />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
