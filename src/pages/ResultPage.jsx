import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, CheckCircle, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
const ResultPage = () => {
  const location = useLocation();
  const { result, image } = location.state || {};
  
  // Normalize processing for backwards compatibility
  const initialProcessing = result?.processing 
    ? (Array.isArray(result.processing) 
        ? { title: 'Rekomendasi Pengolahan', steps: result.processing } 
        : result.processing)
    : null;

  const [currentProcessing, setCurrentProcessing] = useState(initialProcessing);

  if (!result || !image) {
    return <Navigate to="/scan" />;
  }

  const isOrganic = result.category.toLowerCase() === 'organik';

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12">
      <Link to="/scan" className="inline-flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors mb-8">
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Pemindai
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism-card rounded-3xl overflow-hidden sticky top-24"
          >
            <div className="aspect-square relative">
              <img src={image} alt="Scanned waste" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full glassmorphism border-white/20 flex items-center gap-2 backdrop-blur-md">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">{result.confidence} Cocok</span>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 bg-slate-900/50">
              <h3 className="text-sm text-slate-400 mb-1">Kategori Material</h3>
              <p className={`text-3xl font-semibold ${isOrganic ? 'text-green-400' : 'text-blue-400'}`}>
                {result.category}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glassmorphism-card p-8 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Rekomendasi Pengolahan</h2>
              </div>
            </div>
            
            {currentProcessing && currentProcessing.steps && (
              <div>
                <h3 className="text-xl font-semibold text-green-400 mb-4">{currentProcessing.title || 'Rekomendasi'}</h3>
                <ul className="space-y-4">
                  {(currentProcessing.steps || []).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 shrink-0 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </div>
                      <span className="text-slate-300 text-lg leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism-card p-8 rounded-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <RefreshCw className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Potensi Nilai Ekonomi</h2>
            </div>
            <p className="text-2xl font-semibold text-gradient mb-2">{result.value}</p>
            <p className="text-sm text-slate-400">Estimasi nilai jika diolah dengan baik.</p>
          </motion.div>



          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex gap-4"
          >
            <Link
              to="/scan"
              className="flex-1 py-4 rounded-xl border border-green-500/30 text-green-400 hover:bg-green-500/10 font-semibold text-center transition-colors"
            >
              Pindai Ulang
            </Link>
            <Link
              to="/history"
              className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-center transition-colors"
            >
              Lihat Riwayat
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
