import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, History as HistoryIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllHistory, deleteHistory } from '../utils/db';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getAllHistory();
      // Sort by date descending
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus riwayat ini?")) {
      await deleteHistory(id);
      setHistory(history.filter(item => item.id !== id));
    }
  };

  const filteredHistory = history.filter(item => {
    const search = searchTerm.toLowerCase();
    const titleMatch = item.processing?.title ? item.processing.title.toLowerCase().includes(search) : false;
    const productsMatch = item.products ? item.products.some(p => p.name.toLowerCase().includes(search)) : false;
    // Fallback for old data where processing was an array
    const oldArrayMatch = Array.isArray(item.processing) && item.processing.some(p => p.toLowerCase().includes(search));
    return item.category.toLowerCase().includes(search) || titleMatch || productsMatch || oldArrayMatch;
  });

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-2 flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-green-400" />
            Riwayat Pemindaian
          </h1>
          <p className="text-slate-400">Data riwayat Anda tersimpan secara lokal di perangkat ini.</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Cari kategori atau hasil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-xl text-white outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin" />
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glassmorphism-card p-12 rounded-3xl text-center flex flex-col items-center">
          <HistoryIcon className="w-16 h-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Belum ada riwayat</h3>
          <p className="text-slate-400 mb-6">Anda belum melakukan scan atau data tidak ditemukan.</p>
          <Link
            to="/scan"
            className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 font-semibold transition-colors inline-flex items-center gap-2"
          >
            Mulai Pemindaian <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="glassmorphism-card rounded-2xl overflow-hidden group flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-900">
                  <img src={item.image} alt="Scanned" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-semibold ${item.category.toLowerCase() === 'organik' ? 'text-green-400' : 'text-blue-400'}`}>
                      {item.category}
                    </h3>
                  </div>
                  <div className="text-sm text-slate-300 mb-4 flex-1">
                    {item.products ? (
                      <div>
                        <p className="font-medium text-slate-400 mb-1">Rekomendasi Produk:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.products.slice(0, 3).map((prod) => (
                            <span key={prod.id} className="px-2 py-1 bg-slate-800 rounded-lg text-xs border border-white/10">
                              {prod.name}
                            </span>
                          ))}
                          {item.products.length > 3 && (
                            <span className="px-2 py-1 bg-slate-800 rounded-lg text-xs border border-white/10">
                              +{item.products.length - 3} lagi
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium text-slate-400 mb-1">Pengolahan:</p>
                        {item.processing?.title ? (
                          <div>
                            <p className="font-semibold text-white mb-1">{item.processing.title}</p>
                            <p className="text-slate-400 line-clamp-2">{item.processing.steps[0]}</p>
                          </div>
                        ) : (
                          <ul className="list-disc pl-4 space-y-1">
                            {(Array.isArray(item.processing) ? item.processing : []).slice(0, 2).map((p, i) => (
                              <li key={i} className="truncate">{p}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                  <div className="pt-4 border-t border-white/10 mt-auto flex flex-col gap-2">
                    <Link
                      to="/result"
                      state={{ result: { category: item.category, processing: item.processing, products: item.products, value: item.value, confidence: '100% (Riwayat)' }, image: item.image }}
                      className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center justify-center py-2 bg-green-500/10 rounded-xl gap-1 group/link"
                    >
                      Lihat Detail
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    <button
                      onClick={() => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          window.location.href = '/login?redirect=/upload-product';
                        } else {
                          const initialData = {
                            category: item.category,
                            name: item.processing?.title || (item.products && item.products[0]?.name) || '',
                            description: item.processing?.steps ? item.processing.steps.join(' ') : ''
                          };
                          window.location.href = `/upload-product?data=${encodeURIComponent(JSON.stringify(initialData))}`;
                        }
                      }}
                      className="text-white hover:text-white text-sm font-medium flex items-center justify-center py-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                    >
                      Jadikan Produk Etalase
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
