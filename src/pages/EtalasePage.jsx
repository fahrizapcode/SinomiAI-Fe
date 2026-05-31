import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '../utils/api';
import { ShoppingBag, MapPin, User, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EtalasePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Convert 08xxx -> 628xxx for wa.me
  const formatWhatsApp = (number) => {
    if (!number) return '';
    const clean = number.replace(/\D/g, ''); // remove non-digits
    if (clean.startsWith('0')) return '62' + clean.slice(1);
    if (clean.startsWith('62')) return clean;
    return '62' + clean;
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-xl md:text-4xl font-semibold text-slate-900 mb-2 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            Etalase Produk Daur Ulang
          </h1>
          <p className="text-slate-600">Temukan dan bagikan berbagai produk kreatif hasil daur ulang.</p>
        </div>
        <Link
          to="/upload-product"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-2 shadow-md shadow-blue-500/10"
        >
          Pamerkan Produk
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="glassmorphism-card p-12 rounded-xl text-center border border-slate-100 shadow-md">
          <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum ada produk</h3>
          <p className="text-slate-600 mb-6">Jadilah yang pertama memamerkan produk daur ulangmu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism-card rounded-xl overflow-hidden group flex flex-col border border-slate-100 shadow-md"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-50">
                <img
                  src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-blue-600 font-semibold mb-3">Rp {parseInt(product.price).toLocaleString('id-ID')}</p>
                <div className="space-y-2 text-sm text-slate-600 mb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{product.seller_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="line-clamp-1">{product.location}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <a
                    href={`https://wa.me/${formatWhatsApp(product.whatsapp_number)}?text=Halo, saya tertarik dengan produk *${product.name}* yang ada di SinomiAI. Apakah masih tersedia?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors border border-[#25D366]/25 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Hubungi Penjual
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EtalasePage;
