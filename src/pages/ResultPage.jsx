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
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetSelection = () => {
    setProductDetails(null);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12">
      <Link to="/scan" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium">
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Pemindai
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Basic Info */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glassmorphism-card rounded-xl overflow-hidden border border-slate-100 shadow-md sticky top-24"
          >
            <div className="aspect-square relative bg-slate-50">
              <img src={image} alt="Scanned waste" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/90 border border-slate-200 flex items-center gap-2 backdrop-blur-md shadow-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-slate-800">{result.confidence} Cocok</span>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-500 mb-1">Hasil Deteksi AI</h3>
              <p className={`text-3xl font-bold ${isOrganic ? 'text-green-600' : 'text-blue-600'}`}>
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
                <div className="glassmorphism-card p-8 rounded-xl border border-slate-100 shadow-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-yellow-50 rounded-xl">
                      <Lightbulb className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Rekomendasi AI</h2>
                      <p className="text-slate-600 mt-1">Pilih produk bernilai yang ingin kamu buat dari sampah jenis {result.category}.</p>
                    </div>
                  </div>

                  {isLoadingProducts ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                      <p className="text-slate-600 font-medium">AI sedang memikirkan ide-ide kreatif...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((product) => {
                          const isSelected = selectedProduct?.id === product.id;
                          return (
                            <motion.div
                              key={product.id}
                              whileHover={{ y: -2 }}
                              onClick={() => setSelectedProduct(product)}
                              className={`p-5 rounded-xl cursor-pointer border-2 transition-all duration-300 ${isSelected
                                ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10'
                                : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'
                                }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h3 className={`font-bold text-lg ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                                  {product.name}
                                </h3>
                                {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="w-4 h-4 text-green-500" />
                                  <span className="font-semibold text-slate-700">{product.value}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Hammer className="w-4 h-4" />
                                    {product.difficulty}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
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
                        className="mt-8"
                      >
                        <button
                          onClick={handleGenerate}
                          disabled={!selectedProduct || isGenerating}
                          className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                <div className="glassmorphism-card p-8 rounded-xl relative overflow-hidden border border-slate-100 shadow-md">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-3">
                        <CheckCircle className="w-4 h-4" />
                        Panduan Siap
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900">{productDetails.title}</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Estimasi Waktu</p>
                        <p className="font-bold text-slate-800">{productDetails.time}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                      <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Estimasi Nilai Jual</p>
                        <p className="font-bold text-slate-800">{productDetails.value}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Alat dan Bahan */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <Wrench className="w-5 h-5 text-slate-500" />
                        Alat & Bahan
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {productDetails.materials.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Langkah Pengerjaan */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <ListChecks className="w-5 h-5 text-slate-500" />
                        Langkah Pengerjaan
                      </h3>
                      <div className="space-y-4">
                        {productDetails.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                              {idx + 1}
                            </div>
                            <p className="text-slate-700 leading-relaxed pt-1 font-medium">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips & Marketplaces */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-250/60">
                        <h4 className="font-bold text-yellow-700 flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4" />
                          Tips Keberhasilan
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{productDetails.tips}</p>
                      </div>

                      <div className="p-5 rounded-xl bg-blue-50 border border-blue-200/50">
                        <h4 className="font-bold text-blue-700 flex items-center gap-2 mb-2">
                          <ShoppingCart className="w-4 h-4" />
                          Rekomendasi Penjualan
                        </h4>
                        <ul className="text-sm text-slate-700 space-y-1 font-medium">
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

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={resetSelection}
                    className="flex-1 py-4 rounded-lg border border-slate-200 text-slate-650 hover:bg-slate-50 font-semibold text-center transition-colors flex justify-center items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Pilih Produk Lain
                  </button>
                  <Link
                    to="/scan"
                    className="flex-1 py-4 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-center transition-colors flex justify-center items-center gap-2"
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
