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

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-2 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-green-400" />
            Etalase Produk Daur Ulang
          </h1>
          <p className="text-slate-400">Temukan dan bagikan berbagai produk kreatif hasil daur ulang.</p>
        </div>
        <Link
          to="/upload-product"
          className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 font-semibold transition-colors flex items-center gap-2"
        >
          Pamerkan Produk
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="glassmorphism-card p-12 rounded-3xl text-center">
          <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Belum ada produk</h3>
          <p className="text-slate-400 mb-6">Jadilah yang pertama memamerkan produk daur ulangmu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism-card rounded-2xl overflow-hidden group flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-900">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-green-500/80 backdrop-blur-md border border-green-400/20 text-xs font-semibold text-white">
                  {product.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-green-400 font-medium mb-3">Rp {parseInt(product.price).toLocaleString('id-ID')}</p>
                <div className="space-y-2 text-sm text-slate-400 mb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{product.seller_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{product.location}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <a
                    href={`https://wa.me/${product.whatsapp_number}?text=Halo, saya tertarik dengan produk ${product.name} yang ada di SinomiAI`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-xl font-medium flex justify-center items-center gap-2 transition-colors border border-[#25D366]/30"
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
