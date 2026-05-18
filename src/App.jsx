import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ScanPage from './pages/ScanPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import EtalasePage from './pages/EtalasePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadProductPage from './pages/UploadProductPage';
import AnimatedPage from './components/AnimatedPage';

const routeOrder = {
  '/': 0,
  '/scan': 1,
  '/result': 2,
  '/history': 3,
  '/etalase': 4,
  '/login': 5,
  '/register': 6,
  '/upload-product': 7,
};

function App() {
  const location = useLocation();
  const [direction, setDirection] = useState(1);
  const [prevPath, setPrevPath] = useState(location.pathname);

  if (location.pathname !== prevPath) {
    const prevOrder = routeOrder[prevPath] ?? 0;
    const currentOrder = routeOrder[location.pathname] ?? 0;
    setDirection(currentOrder >= prevOrder ? 1 : -1);
    setPrevPath(location.pathname);
  }
  
  return (
    <div className="min-h-screen text-white font-sans selection:bg-green-500/30 flex flex-col relative">
      <Navbar />
      <main className="pt-20 pb-12 overflow-x-hidden flex-1 flex flex-col relative">
        <AnimatePresence mode="wait" custom={direction}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage direction={direction}><LandingPage /></AnimatedPage>} />
            <Route path="/scan" element={<AnimatedPage direction={direction}><ScanPage /></AnimatedPage>} />
            <Route path="/result" element={<AnimatedPage direction={direction}><ResultPage /></AnimatedPage>} />
            <Route path="/history" element={<AnimatedPage direction={direction}><HistoryPage /></AnimatedPage>} />
            <Route path="/etalase" element={<AnimatedPage direction={direction}><EtalasePage /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage direction={direction}><LoginPage /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage direction={direction}><RegisterPage /></AnimatedPage>} />
            <Route path="/upload-product" element={<AnimatedPage direction={direction}><UploadProductPage /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="border-t border-white/10 glassmorphism py-8 text-center text-slate-500 w-full mt-auto relative z-10">
        <p>© 2026 SinomiAI. Transform Waste Into Value.</p>
      </footer>
    </div>
  );
}

export default App;
