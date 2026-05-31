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
          <h1 className="text-4xl font-semibold text-slate-900 mb-2 flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-blue-600" />
            Riwayat Pemindaian
          </h1>
          <p className="text-slate-600">Data riwayat Anda tersimpan secara lokal di perangkat ini.</p>
        </div>

        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari kategori atau hasil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-800 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glassmorphism-card p-12 rounded-xl text-center flex flex-col items-center border border-slate-100 shadow-md">
          <HistoryIcon className="w-16 h-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Riwayat tidak ditemukan</h3>
          <p className="text-slate-600 mb-6">Anda belum melakukan scan atau data tidak ditemukan.</p>
          <Link
            to="/scan"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors inline-flex items-center gap-2 shadow-md shadow-blue-500/10"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glassmorphism-card rounded-xl overflow-hidden group flex flex-col border border-slate-100 shadow-md"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <img src={item.image} alt="Scanned" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-semibold ${item.category.toLowerCase() === 'organik' ? 'text-green-600' : 'text-blue-600'}`}>
                      {item.category}
                    </h3>
                  </div>
                  <div className="text-sm text-slate-600 mb-4 flex-1">
                    {item.products ? (
                      <div>
                        <p className="font-semibold text-slate-500 mb-1">Rekomendasi Produk:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.products.slice(0, 3).map((prod) => (
                            <span key={prod.id} className="px-2.5 py-1 bg-slate-50 rounded-lg text-xs border border-slate-100 text-slate-700 font-medium">
                              {prod.name}
                            </span>
                          ))}
                          {item.products.length > 3 && (
                            <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs border border-slate-200 text-slate-700 font-medium">
                              +{item.products.length - 3} lagi
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-500 mb-1">Produk:</p>
                        {item.processing?.title ? (
                          <div>
                            <p className="font-semibold text-slate-800 mb-1">{item.processing.title}</p>
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
                  <div className="pt-4 border-t border-slate-100 mt-auto flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          window.location.href = '/login?redirect=/upload-product';
                        } else {
                          const initialData = {
                            category: item.category,
                            name: item.processing?.title || (item.products && item.products[0]?.name) || '',
                            description: ""
                          };
                          window.location.href = `/upload-product?data=${encodeURIComponent(JSON.stringify(initialData))}`;
                        }
                      }}
                      className="text-white hover:text-white text-sm font-semibold cursor-pointer flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
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
