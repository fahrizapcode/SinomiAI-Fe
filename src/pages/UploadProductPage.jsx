import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, ArrowLeft, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { uploadProduct } from '../utils/api';

const UploadProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    location: '',
    whatsapp_number: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?redirect=/upload-product');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setFormData(prev => ({
        ...prev,
        location: user.location || '',
        whatsapp_number: user.whatsapp_number || ''
      }));
    }

    const searchParams = new URLSearchParams(location.search);
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const initialData = JSON.parse(decodeURIComponent(dataParam));
        setFormData(prev => ({
          ...prev,
          name: initialData.name || '',
          category: initialData.category || '',
        }));
      } catch (e) {
        console.error("Failed to parse initial data");
      }
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Silakan upload foto produk.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
      submitData.append('image', file);

      await uploadProduct(submitData, token);
      navigate('/etalase');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 min-h-[80vh]">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 sm:mb-8 font-medium text-sm sm:text-base">
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Kembali
      </button>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism-card p-5 sm:p-8 rounded-xl border border-slate-100 shadow-md"
        >
          <div className="mb-6 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1 sm:mb-2">Pamerkan Produkmu</h2>
            <p className="text-slate-600 text-sm sm:text-base">Isi detail produk daur ulang yang ingin kamu tampilkan di Etalase.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-650 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Foto Produk</label>
                {!previewUrl ? (
                  <div
                    className="border-2 border-dashed border-blue-200 rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="p-3 bg-blue-50 rounded-full">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">Klik untuk memilih foto</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-50 border border-slate-100 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-semibold shadow-md"
                      >
                        <ImageIcon className="w-4 h-4" /> Ganti Foto
                      </button>
                    </div>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Produk</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-800 outline-none transition-all shadow-sm" placeholder="Contoh: Tas Daur Ulang" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-800 outline-none transition-all shadow-sm appearance-none cursor-pointer">
                  <option value="" disabled>Pilih Kategori</option>
                  <option value="Organik">Organik</option>
                  <option value="Anorganik">Anorganik</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Harga (Rp)</label>
                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-800 outline-none transition-all shadow-sm" placeholder="50000" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Lokasi</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-800 outline-none transition-all shadow-sm" placeholder="Jakarta" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                <input type="text" name="whatsapp_number" required value={formData.whatsapp_number} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-800 outline-none transition-all shadow-sm" placeholder="081234567890" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                  Deskripsi Produk
                  <span className="text-slate-400 font-normal">{formData.description.length}/200</span>
                </label>
                <textarea name="description" required maxLength="200" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-800 outline-none resize-none transition-all shadow-sm" placeholder="Ceritakan bahan yang digunakan dan proses pembuatannya..."></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all mt-4 sm:mt-6 shadow-md shadow-blue-500/10 disabled:opacity-75 text-sm sm:text-base"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Publish ke Etalase
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadProductPage;
