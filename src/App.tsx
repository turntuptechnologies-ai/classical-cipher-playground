import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CaesarPage from "./pages/CaesarPage";
import SubstitutionPage from "./pages/SubstitutionPage";
import VigenerePage from "./pages/VigenerePage";
import RailFencePage from "./pages/RailFencePage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/caesar" element={<CaesarPage />} />
          <Route path="/substitution" element={<SubstitutionPage />} />
          <Route path="/vigenere" element={<VigenerePage />} />
          <Route path="/railfence" element={<RailFencePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
