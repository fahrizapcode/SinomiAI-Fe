import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Scan, Recycle, Database, Leaf } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <div
    className="glassmorphism-card hover:-translate-y-1 p-8 rounded-xl flex flex-col items-center text-center gap-4 transition-all duration-350 cursor-pointer border border-slate-100/80 shadow-md"
  >
    <div className="p-3 bg-blue-50 rounded-full text-blue-600 mb-2">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const MasonryItem = ({ image, title, aspectClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className={`group relative rounded-lg overflow-hidden w-full bg-slate-50 shadow-sm hover:shadow-md transition-shadow duration-300 ${aspectClass}`}
  >
    <img
      src={image}
      alt={title}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
    />
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
            Ubah <span className="text-gradient">Sampahmu</span> Menjadi <br className="hidden lg:block" /> Berharga dengan AI
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Mari melihat sampah bukan sebagai masalah, tetapi sebagai peluang untuk menciptakan nilai, menjaga lingkungan, dan membangun masa depan yang lebih berkelanjutan.
          </p>
          <div className="mt-2 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/scan"
              className="relative overflow-hidden inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] hover:bg-right text-white font-semibold text-lg transition-all duration-500 shadow-xl shadow-blue-500/30 hover:shadow-indigo-500/40 group"
            >
              {/* Shine effect */}
              <div className="absolute top-0 left-[-100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] group-hover:left-[200%] transition-all duration-1000 ease-out z-0" />

              <span className="relative z-10 flex items-center gap-2 font-semibold text-lg">
                Pindai Sampah Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 mt-[3px]" />
              </span>
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
            description="Cukup upload gambar sampah, AI kami mendeteksi dan mengkategorikan sampah secara instan."
          />
          <FeatureCard
            icon={<Recycle className="w-8 h-8" />}
            title="Ide Ekonomi Sirkular"
            description="Dapatkan rekomendasi praktis tentang cara mengolah sampah menjadi kompos atau kerajinan daur ulang yang bernilai."
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
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Galeri Kreativitas</h2>
            <p className="text-slate-600 max-w-xl">Lihat bagaimana sampah biasa dapat diubah menjadi produk kreatif yang bernilai ekonomi tinggi.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kolom 1 */}
          <div className="flex flex-col gap-6">
            <MasonryItem image="/craft/c1.jpg" title="Karya 1" aspectClass="aspect-[3/4]" delay={0.1} />
            <MasonryItem image="/craft/c2.jpg" title="Karya 2" aspectClass="aspect-[4/3]" delay={0.2} />
            <MasonryItem image="/craft/c3.jpg" title="Karya 3" aspectClass="aspect-square" delay={0.3} />
          </div>

          {/* Kolom 2 */}
          <div className="flex flex-col gap-6">
            <MasonryItem image="/craft/c4.jpg" title="Karya 4" aspectClass="aspect-[4/3]" delay={0.2} />
            <MasonryItem image="/craft/c5.jpg" title="Karya 5" aspectClass="aspect-[3/4]" delay={0.3} />
            <MasonryItem image="/craft/c6.jpg" title="Karya 6" aspectClass="aspect-square" delay={0.4} />
          </div>

          {/* Kolom 3 */}
          <div className="flex flex-col gap-6">
            <MasonryItem image="/craft/c7.jpg" title="Karya 7" aspectClass="aspect-square" delay={0.3} />
            <MasonryItem image="/craft/c8.jpg" title="Karya 8" aspectClass="aspect-[4/3]" delay={0.4} />
            <MasonryItem image="/craft/c9.jpg" title="Karya 9" aspectClass="aspect-[3/4]" delay={0.5} />
          </div>
        </div>
      </section >
    </div >
  );
};

export default LandingPage;
