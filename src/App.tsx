import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CaesarPage from "./pages/CaesarPage";
import SubstitutionPage from "./pages/SubstitutionPage";
import VigenerePage from "./pages/VigenerePage";
import RailFencePage from "./pages/RailFencePage";
import UesugiPage from "./pages/UesugiPage";
import EnigmaPage from "./pages/EnigmaPage";

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
          <Route path="/uesugi" element={<UesugiPage />} />
          <Route path="/enigma" element={<EnigmaPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
