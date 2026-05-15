import React, { useState } from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Lightbulb, RefreshCw, 
  Leaf, Droplet, Bug, Sprout, FlaskConical, 
  Flower2, Box, PenTool, Layers, ChevronRight,
  Clock, TrendingUp, Hammer, DollarSign, ShoppingCart, Info, Wrench, ListChecks
} from 'lucide-react';
import { generateStepByStep } from '../utils/api';
import { addHistory } from '../utils/db';

const IconMap = {
  Leaf, Droplet, Bug, Sprout, FlaskConical, 
  Flower2, Box, PenTool, Lightbulb, Layers
};

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, image } = location.state || {};
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  if (!result || !image) {
    return <Navigate to="/scan" />;
  }

  const isOrganic = result.category.toLowerCase() === 'organik';
  const products = result.products || [];

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setIsGenerating(true);
    try {
      const data = await generateStepByStep(selectedProduct.id);
      setProductDetails(data.details);
      
      await addHistory({
        image: image,
        category: result.category,
        products: [selectedProduct],
        processing: data.details,
        value: selectedProduct.value
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetSelection = () => {
    setSelectedProduct(null);
    setProductDetails(null);
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12">
      <Link to="/scan" className="inline-flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors mb-8">
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Pemindai
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Basic Info */}
        <div className="lg:col-span-4">
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
              <h3 className="text-sm text-slate-400 mb-1">Hasil Deteksi AI</h3>
              <p className={`text-3xl font-semibold ${isOrganic ? 'text-green-400' : 'text-blue-400'}`}>
                {result.category}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interaction Flow */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!productDetails ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="glassmorphism-card p-8 rounded-3xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                      <Lightbulb className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white">Pilih Produk Bernilai</h2>
                      <p className="text-slate-400 mt-1">Opsi pengolahan terbaik berdasarkan jenis sampah.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {products.map((product) => {
                      const isSelected = selectedProduct?.id === product.id;
                      return (
                        <motion.div
                          key={product.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedProduct(product)}
                          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col xl:flex-row xl:items-center justify-between gap-4 ${
                            isSelected 
                              ? 'border-green-400 bg-green-500/10' 
                              : 'border-white/10 bg-slate-800/50 hover:border-green-400/50 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex-1 pr-8 xl:pr-0">
                            <h3 className="text-lg font-semibold text-white mb-2 xl:mb-0">{product.name}</h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm xl:justify-end">
                            <div className="flex items-center gap-2 text-slate-300">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span>{product.value}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Hammer className="w-4 h-4 text-orange-400" />
                              <span>Tingkat: {product.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span>{product.time}</span>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="absolute top-5 right-5 xl:static text-green-400 flex-shrink-0">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {selectedProduct && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8"
                    >
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 font-semibold text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            AI Sedang Menyusun Panduan...
                          </>
                        ) : (
                          <>
                            Generate Step-by-Step Pengolahan
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="glassmorphism-card p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-3">
                        <CheckCircle className="w-4 h-4" />
                        Panduan Siap
                      </div>
                      <h2 className="text-3xl font-semibold text-white">{productDetails.title}</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Estimasi Waktu</p>
                        <p className="font-semibold text-white">{productDetails.time}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Estimasi Nilai Jual</p>
                        <p className="font-semibold text-white">{productDetails.value}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Alat dan Bahan */}
                    <div>
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <Wrench className="w-5 h-5 text-slate-400" />
                        Alat & Bahan
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {productDetails.materials.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5 text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Langkah Pengerjaan */}
                    <div>
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                        <ListChecks className="w-5 h-5 text-slate-400" />
                        Langkah Pengerjaan
                      </h3>
                      <div className="space-y-4">
                        {productDetails.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-white/5">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">
                              {idx + 1}
                            </div>
                            <p className="text-slate-300 leading-relaxed pt-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips & Marketplaces */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                        <h4 className="font-semibold text-yellow-400 flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4" />
                          Tips Keberhasilan
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{productDetails.tips}</p>
                      </div>
                      
                      <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <h4 className="font-semibold text-blue-400 flex items-center gap-2 mb-2">
                          <ShoppingCart className="w-4 h-4" />
                          Rekomendasi Penjualan
                        </h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          {productDetails.marketplaces.map((m, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-blue-400">•</span> {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={resetSelection}
                    className="flex-1 py-4 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 font-semibold text-center transition-colors flex justify-center items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Pilih Produk Lain
                  </button>
                  <Link
                    to="/scan"
                    className="flex-1 py-4 rounded-xl border border-green-500/30 text-green-400 hover:bg-green-500/10 font-semibold text-center transition-colors flex justify-center items-center gap-2"
                  >
                    <Box className="w-4 h-4" />
                    Scan Sampah Baru
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
