import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Lightbulb, RefreshCw,
  Leaf, Droplet, Bug, Sprout, FlaskConical,
  Flower2, Box, PenTool, Layers, ChevronRight,
  Clock, TrendingUp, Hammer, DollarSign, ShoppingCart, Info, Wrench, ListChecks
} from 'lucide-react';
import { generateProducts, generateStepByStep } from '../utils/api';
import { addHistory } from '../utils/db';

const IconMap = {
  Leaf, Droplet, Bug, Sprout, FlaskConical,
  Flower2, Box, PenTool, Lightbulb, Layers
};

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, image } = location.state || {};

  const [products, setProducts] = useState([]);
  const [errorProducts, setErrorProducts] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorSteps, setErrorSteps] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  if (!result || !image) {
    return <Navigate to="/scan" />;
  }

  const isOrganic = result.category.toLowerCase().includes('organik');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const data = await generateProducts(result.category);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [result.category]);

  const handleGenerate = async () => {
    if (!selectedProduct) return;

    setIsGenerating(true);
    setErrorSteps(null);
    try {
      const data = await generateStepByStep(result.category, selectedProduct.name);
      setProductDetails(data.details);

      await addHistory({
        image: image,
        category: result.category,
        processing: data.details,
        value: data.details.value
      });
    } catch (error) {
      console.error("Failed to generate steps:", error);
      setErrorSteps("Gagal menyusun panduan langkah-langkah. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
      <Link to="/scan" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 sm:mb-8 font-medium text-sm sm:text-base">
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Kembali ke Pemindai
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Image & Basic Info */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism-card rounded-lg overflow-hidden border border-slate-100 shadow-md lg:sticky lg:top-24"
          >
            <div className="aspect-video sm:aspect-square relative bg-slate-50">
              <img src={image} alt="Scanned waste" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 border border-slate-200 flex items-center gap-2 backdrop-blur-md shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span className="text-xs sm:text-md font-semibold text-slate-800">{result.confidence} Cocok</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50">
              <h3 className="text-sm sm:text-md font-semibold text-slate-500 mb-1">Hasil Deteksi AI</h3>
              <p className={`text-xl sm:text-2xl font-semibold ${isOrganic ? 'text-green-600' : 'text-blue-600'}`}>
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
                <div className="p-5 sm:p-8 rounded-xl border border-slate-100 shadow-md">
                  <div className="flex items-center gap-3 mb-5 sm:mb-6 bg-blue-100 p-3 sm:p-4 rounded-lg">
                    <div className="p-2 sm:p-3 bg-white rounded-xl shrink-0">
                      <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-semibold text-blue-700">Rekomendasi AI</h2>
                      <p className="text-blue-500 mt-0.5 sm:mt-1 text-xs sm:text-sm">Pilih produk bernilai dari sampah jenis {result.category}.</p>
                    </div>
                  </div>

                  {isLoadingProducts ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                      <p className="text-slate-600 font-medium">AI sedang memikirkan ide-ide kreatif...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {products.map((product) => {
                          const isSelected = selectedProduct?.id === product.id;
                          return (
                            <motion.div
                              key={product.id}
                              whileHover={{ y: -2 }}
                              onClick={() => setSelectedProduct(product)}
                              className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${isSelected
                                ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10'
                                : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'
                                }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-semibold text-sm sm:text-base leading-snug pr-2 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                                  {product.name}
                                </h3>
                                {isSelected && <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                                  <DollarSign className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                  <span className="font-semibold text-slate-700">{product.value}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Hammer className="w-3.5 h-3.5 shrink-0" />
                                    {product.difficulty}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 shrink-0" />
                                    {product.time}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: selectedProduct ? 1 : 0.5, y: 0 }}
                        className="mt-8 flex flex-col gap-3"
                      >
                        {errorSteps && (
                          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium border border-red-100">
                            {errorSteps}
                          </div>
                        )}
                        <button
                          onClick={handleGenerate}
                          disabled={!selectedProduct || isGenerating}
                          className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm lg:text-lg shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    </>
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
                <div className="glassmorphism-card p-5 sm:p-8 rounded-xl relative overflow-hidden border border-slate-100 shadow-md">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-5 sm:mb-8">
                    <div>
                      <h2 className="text-xl sm:text-3xl font-semibold text-slate-900">{productDetails.title}</h2>
                    </div>
                  </div>

                  {/* Info cards: Estimasi Waktu & Nilai Jual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 sm:mb-8">
                    <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                        <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Estimasi Waktu</p>
                        <p className="font-semibold text-slate-800 text-sm md:text-lg">{productDetails.time}</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-green-50 rounded-xl text-green-600 shrink-0">
                        <DollarSign className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Estimasi Nilai Jual</p>
                        <p className="font-semibold text-slate-800 text-sm md:text-lg">{productDetails.value}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    {/* Alat dan Bahan */}
                    <div>
                      <h3 className="text-base sm:text-xl font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
                        Alat & Bahan
                      </h3>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <ul className="flex flex-col gap-2.5">
                          {productDetails.materials.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-slate-700 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2"></div>
                              <span className="leading-relaxed text-sm sm:text-md">{item.replace(/\*/g, '')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Langkah Pengerjaan */}
                    <div>
                      <h3 className="text-base sm:text-xl font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
                        Langkah Pengerjaan
                      </h3>
                      <div className="space-y-3">
                        {productDetails.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs sm:text-sm">
                              {idx + 1}
                            </div>
                            <p className="text-slate-700 leading-relaxed text-sm sm:text-md font-medium">
                              {step.replace(/\*/g, '')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips & Marketplaces */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200/60">
                        <h4 className="font-semibold text-yellow-700 flex items-center gap-1.5 mb-2 text-sm sm:text-base">
                          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          Tips Keberhasilan
                        </h4>
                        <p className="text-sm sm:text-md text-slate-700 leading-relaxed font-medium">{productDetails.tips}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/50">
                        <h4 className="font-semibold text-blue-700 flex items-center gap-1.5 mb-2 text-sm sm:text-base">
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          Rekomendasi Penjualan
                        </h4>
                        <ul className="text-sm sm:text-md text-slate-700 space-y-1 font-medium">
                          {productDetails.marketplaces.map((m, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-blue-600">•</span> {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">

                  <Link
                    to="/scan"
                    className="flex-1 py-3 sm:py-4 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-center transition-colors flex justify-center items-center gap-2 text-sm sm:text-base"
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
    </div >
  );
};

export default ResultPage;
