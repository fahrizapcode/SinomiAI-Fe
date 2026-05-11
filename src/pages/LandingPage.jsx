import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Scan, Recycle, Database, Sparkles, Image as ImageIcon, Bot, Brain } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay }) => (
  <div
    className="glassmorphism-card hover:rotate-3 p-8 rounded-2xl flex flex-col items-start gap-4 transition-transform cursor-pointer"
  >
    <div className="p-3 bg-green-500/10 rounded-xl text-green-400 mb-2">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const GalleryItem = ({ image, category, title, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative rounded-2xl overflow-hidden aspect-square sm:aspect-video md:aspect-square bg-slate-800"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
    <img
      src={image}
      alt={title}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    <div className="absolute bottom-0 left-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
      <span className="text-xs font-semibold tracking-wider text-green-400 mb-2 block">{category}</span>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
    </div>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Mobile Badge */}
        <div className="lg:hidden flex justify-center order-1 mb-[-2rem] z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism border-green-500/20 text-green-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Circular Economy</span>
          </div>
        </div>

        {/* Hero Animation Right (Orbit) - Order 2 on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full max-w-xl aspect-square flex items-center justify-center mx-auto order-2 lg:order-2 z-10"
        >
          {/* Orbit Rings */}
          <div className="absolute w-[80%] h-[80%] rounded-full border border-green-500/20" />
          <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-green-500/30" />
          <div className="absolute w-[40%] h-[40%] rounded-full bg-green-500/5 backdrop-blur-3xl" />

          {/* Center Element (Recycle) */}
          <div className="relative z-10 w-48 h-48 rounded-full bg-slate-900 border-2 border-green-400 shadow-[0_0_50px_rgba(34,197,94,0.3)] flex items-center justify-center">
            <Recycle className="w-24 h-24 text-green-400" />
          </div>

          {/* Orbiting Elements Container */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[80%] h-[80%] rounded-full"
          >
            {/* Image Icon Node (Top) */}
            <motion.div
              className="absolute p-4 rounded-xl glassmorphism-card border-green-500/30 flex items-center justify-center"
              style={{ width: '80px', height: '80px', top: '0%', left: '50%', x: '-50%', y: '-50%' }}
              animate={{ rotate: -360 }}
              transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" } }}
            >
              <Bot className="w-10 h-10 text-blue-400" />
            </motion.div>

            {/* Rupiah Icon Node (Bottom Right) */}
            <motion.div
              className="absolute p-4 rounded-xl glassmorphism-card border-green-500/30 flex items-center justify-center font-semibold text-xl text-green-400"
              style={{ width: '80px', height: '80px', top: '75%', left: '93.3%', x: '-50%', y: '-50%' }}
              animate={{ rotate: -360 }}
              transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" } }}
            >
              Rp
            </motion.div>

            {/* AI Icon Node (Bottom Left) */}
            <motion.div
              className="absolute p-4 rounded-xl glassmorphism-card border-green-500/30 flex items-center justify-center"
              style={{ width: '80px', height: '80px', top: '75%', left: '6.7%', x: '-50%', y: '-50%' }}
              animate={{ rotate: -360 }}
              transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" } }}
            >
              <Brain className="w-10 h-10 text-purple-400" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Text Content - Order 3 on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 z-10 order-3 lg:order-1"
        >
          {/* Desktop Badge */}
          <div className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism border-green-500/20 text-green-400 text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Circular Economy</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold text-white leading-tight">
            Transform <span className="text-gradient">Waste</span> Into <br className="hidden lg:block" /> Value with AI
          </h1>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Pindai sampahmu dan temukan potensi daur ulang, estimasi nilai ekonomi, serta cara pengolahan terbaiknya secara instan. Bergabunglah dengan revolusi ekonomi sirkular hari ini.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/scan"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 font-semibold transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] group"
            >
              Scan Sampah Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 lg:px-12 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4">Mengapa SinomiAi?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Platform kami memadukan kecerdasan buatan dengan solusi ekonomi sirkular praktis untuk mengubah sampah sehari-hari menjadi sumber daya bernilai.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Scan className="w-8 h-8" />}
            title="Klasifikasi Sampah Ai"
            description="Sistem visi cerdas kami mendeteksi dan mengkategorikan sampah organik dan anorganik secara instan dengan akurasi tinggi."
            delay={0.1}
          />
          <FeatureCard
            icon={<Recycle className="w-8 h-8" />}
            title="Ide Ekonomi Sirkular"
            description="Dapatkan rekomendasi praktis tentang cara mengolah sampah menjadi kompos, eko-enzim, atau kerajinan daur ulang kreatif."
            delay={0.3}
          />
          <FeatureCard
            icon={<Database className="w-8 h-8" />}
            title="Riwayat Pintar Lokal"
            description="Riwayat pemindaianmu disimpan secara aman di perangkatmu, memungkinkanmu melacak perjalanan daur ulang kapan saja."
            delay={0.5}
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-6 lg:px-12 py-12 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4">Inspirasi Daur Ulang</h2>
            <p className="text-slate-400 max-w-xl">Lihat bagaimana sampah biasa dapat diubah menjadi produk kreatif yang bernilai ekonomi tinggi.</p>
          </div>
          <Link to="/scan" className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 group">
            Mulai berkreasi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          <GalleryItem
            title="Pot Bunga Estetik"
            category="Botol Plastik"
            image="https://images.unsplash.com/photo-1595856422201-9a9978711822?auto=format&fit=crop&q=80&w=400"
            delay={0.1}
          />
          <GalleryItem
            title="Tas Belanja"
            category="Kemasan Kopi"
            image="https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=400"
            delay={0.2}
          />
          <GalleryItem
            title="Lampu Hias"
            category="Kardus Bekas"
            image="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400"
            delay={0.3}
          />
          <GalleryItem
            title="Rak Buku Mini"
            category="Kayu Palet"
            image="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=400"
            delay={0.4}
          />
          <GalleryItem
            title="Tempat Pensil"
            category="Kaleng Bekas"
            image="https://images.unsplash.com/photo-1585255474753-48895085ea4f?auto=format&fit=crop&q=80&w=400"
            delay={0.5}
          />
          {/* Row 2 */}
          <GalleryItem
            title="Kompos Organik"
            category="Sisa Makanan"
            image="https://images.unsplash.com/photo-1595274457723-9c98bd0ea0d9?auto=format&fit=crop&q=80&w=400"
            delay={0.6}
          />
          <GalleryItem
            title="Keranjang Serbaguna"
            category="Koran Bekas"
            image="https://images.unsplash.com/photo-1621459580665-27a3c316719e?auto=format&fit=crop&q=80&w=400"
            delay={0.1}
          />
          <GalleryItem
            title="Hiasan Dinding"
            category="Tutup Botol"
            image="https://images.unsplash.com/photo-1618424181497-157f25b6ce5e?auto=format&fit=crop&q=80&w=400"
            delay={0.2}
          />
          <GalleryItem
            title="Vas Kaca Daur Ulang"
            category="Pecahan Beling"
            image="https://images.unsplash.com/photo-1578339850257-8fb6b4f6bb99?auto=format&fit=crop&q=80&w=400"
            delay={0.3}
          />
          <GalleryItem
            title="Eco Enzyme"
            category="Kulit Buah"
            image="https://images.unsplash.com/photo-1581579186913-46eaec8ee7c8?auto=format&fit=crop&q=80&w=400"
            delay={0.4}
          />

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
