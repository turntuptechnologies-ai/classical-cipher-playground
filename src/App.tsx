import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CaesarPage from "./pages/CaesarPage";
import SubstitutionPage from "./pages/SubstitutionPage";
import VigenerePage from "./pages/VigenerePage";
import RailFencePage from "./pages/RailFencePage";
import UesugiPage from "./pages/UesugiPage";
import EnigmaPage from "./pages/EnigmaPage";
import ScytalePage from "./pages/ScytalePage";
import GeometricPage from "./pages/GeometricPage";
import AtbashPage from "./pages/AtbashPage";
import PigpenPage from "./pages/PigpenPage";
import PlayfairPage from "./pages/PlayfairPage";
import AdfgvxPage from "./pages/AdfgvxPage";
import PolybiusPage from "./pages/PolybiusPage";
import ColumnarPage from "./pages/ColumnarPage";
import ChallengesPage from "./pages/ChallengesPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import CryptanalysisPage from "./pages/CryptanalysisPage";
import FrequencyAnalysisPage from "./pages/FrequencyAnalysisPage";
import BruteForcePage from "./pages/BruteForcePage";
import KasiskiPage from "./pages/KasiskiPage";
import AnagramPage from "./pages/AnagramPage";

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
          <Route path="/scytale" element={<ScytalePage />} />
          <Route path="/geometric" element={<GeometricPage />} />
          <Route path="/atbash" element={<AtbashPage />} />
          <Route path="/pigpen" element={<PigpenPage />} />
          <Route path="/playfair" element={<PlayfairPage />} />
          <Route path="/adfgvx" element={<AdfgvxPage />} />
          <Route path="/polybius" element={<PolybiusPage />} />
          <Route path="/columnar" element={<ColumnarPage />} />
          <Route path="/cryptanalysis" element={<CryptanalysisPage />} />
          <Route path="/cryptanalysis/frequency" element={<FrequencyAnalysisPage />} />
          <Route path="/cryptanalysis/bruteforce" element={<BruteForcePage />} />
          <Route path="/cryptanalysis/kasiski" element={<KasiskiPage />} />
          <Route path="/cryptanalysis/anagram" element={<AnagramPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
