import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Scan, Recycle, Database, Leaf } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <div
    className="glassmorphism-card hover:-translate-y-1 p-8 rounded-xl flex flex-col items-start gap-4 transition-all duration-350 cursor-pointer border border-slate-100/80 shadow-md"
  >
    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mb-2">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const GalleryItem = ({ image, category, title, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative rounded-xl overflow-hidden aspect-square sm:aspect-video md:aspect-square bg-slate-100 shadow-sm"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
    <img
      src={image}
      alt={title}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
    <div className="absolute bottom-0 left-0 p-6 z-20 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
      <span className="text-xs font-semibold tracking-wider text-blue-400 mb-2 block">{category}</span>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
    </div>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-12 pt-6 min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Text Content - Order 2 on mobile, Order 1 on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 z-10 order-2 lg:order-1"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight tracking-tight w-full">
            Ubah <span className="text-gradient">Sampah</span> Menjadi <br className="hidden lg:block" /> Berharga dengan AI
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Pindai sampahmu dan temukan potensi daur ulang, estimasi nilai ekonomi, serta cara pengolahan terbaiknya secara instan. Bergabunglah dengan revolusi ekonomi sirkular hari ini.
          </p>
          <div className="mt-2 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/scan"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md hover:shadow-lg shadow-blue-500/20 group"
            >
              Scan Sampah Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* 2 Gambar Vertikal Offset - Order 1 on mobile, Order 2 on desktop */}
        <div className="relative w-full max-w-[500px] aspect-[4/4.2] mx-auto order-1 lg:order-2 flex items-center justify-center z-10">
          {/* Gambar atas: value.jpg (Top Left) */}
          <div className="absolute top-4 left-0 w-[70%] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl z-20">
            <img
              src="/value.jpg"
              alt="Produk Daur Ulang Bernilai"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gambar bawah: trash.jpg (Bottom Right) */}
          <div className="absolute bottom-4 right-0 w-[70%] aspect-[4/3] rounded-xl overflow-hidden shadow-lg z-10">
            <img
              src="/trash.jpg"
              alt="Sampah / Bahan Baku"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 lg:px-12 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Mengapa SinomiAi?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Platform kami memadukan kecerdasan buatan dengan solusi ekonomi sirkular praktis untuk mengubah sampah sehari-hari menjadi sumber daya bernilai.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Scan className="w-8 h-8" />}
            title="Klasifikasi Sampah Ai"
            description="Sistem visi cerdas kami mendeteksi dan mengkategorikan sampah organik dan anorganik secara instan dengan akurasi tinggi."
          />
          <FeatureCard
            icon={<Recycle className="w-8 h-8" />}
            title="Ide Ekonomi Sirkular"
            description="Dapatkan rekomendasi praktis tentang cara mengolah sampah menjadi kompos, eko-enzim, atau kerajinan daur ulang kreatif."
          />
          <FeatureCard
            icon={<Database className="w-8 h-8" />}
            title="Riwayat Pintar Lokal"
            description="Riwayat pemindaianmu disimpan secara aman di perangkatmu, memungkinkanmu melacak perjalanan daur ulang kapan saja."
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-6 lg:px-12 py-12 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Inspirasi Daur Ulang</h2>
            <p className="text-slate-600 max-w-xl">Lihat bagaimana sampah biasa dapat diubah menjadi produk kreatif yang bernilai ekonomi tinggi.</p>
          </div>
          <Link to="/scan" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group">
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
            delay={0.15}
          />
          <GalleryItem
            title="Lampu Hias"
            category="Kardus Bekas"
            image="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400"
            delay={0.2}
          />
          <GalleryItem
            title="Rak Buku Mini"
            category="Kayu Palet"
            image="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=400"
            delay={0.25}
          />
          <GalleryItem
            title="Tempat Pensil"
            category="Kaleng Bekas"
            image="https://images.unsplash.com/photo-1585255474753-48895085ea4f?auto=format&fit=crop&q=80&w=400"
            delay={0.3}
          />
          {/* Row 2 */}
          <GalleryItem
            title="Kompos Organik"
            category="Sisa Makanan"
            image="https://images.unsplash.com/photo-1595274457723-9c98bd0ea0d9?auto=format&fit=crop&q=80&w=400"
            delay={0.35}
          />
          <GalleryItem
            title="Keranjang Serbaguna"
            category="Koran Bekas"
            image="https://images.unsplash.com/photo-1621459580665-27a3c316719e?auto=format&fit=crop&q=80&w=400"
            delay={0.4}
          />
          <GalleryItem
            title="Hiasan Dinding"
            category="Tutup Botol"
            image="https://images.unsplash.com/photo-1618424181497-157f25b6ce5e?auto=format&fit=crop&q=80&w=400"
            delay={0.45}
          />
          <GalleryItem
            title="Vas Kaca Daur Ulang"
            category="Pecahan Beling"
            image="https://images.unsplash.com/photo-1578339850257-8fb6b4f6bb99?auto=format&fit=crop&q=80&w=400"
            delay={0.5}
          />
          <GalleryItem
            title="Eco Enzyme"
            category="Kulit Buah"
            image="https://images.unsplash.com/photo-1581579186913-46eaec8ee7c8?auto=format&fit=crop&q=80&w=400"
            delay={0.55}
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
