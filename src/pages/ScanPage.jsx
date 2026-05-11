import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';
import { classifyWaste } from '../utils/api';
import { addHistory } from '../utils/db';

const ScanPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const resetSelection = () => {
    setFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startScan = async () => {
    if (!file) return;
    setIsScanning(true);
    
    // Animate scan text steps
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1000);

    try {
      // Dummy API Call
      const result = await classifyWaste(file);
      
      // Save to IndexedDB
      // We store the previewUrl as a data URL or just rely on blob URL for current session.
      // For real app, convert to base64 or upload to server.
      // Here we will use base64 for history to persist.
      const base64 = await convertToBase64(file);
      
      const historyItem = {
        image: base64,
        category: result.category,
        processing: result.processing,
        value: result.value
      };
      await addHistory(historyItem);

      clearInterval(stepInterval);
      navigate('/result', { state: { result, image: base64 } });
    } catch (error) {
      console.error(error);
      setIsScanning(false);
      clearInterval(stepInterval);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const scanMessages = [
    "Menganalisis Sampah...",
    "Mengkategorikan Material...",
    "Menghasilkan Rekomendasi Ekonomi Sirkular..."
  ];

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-white mb-4">Scan Sampah</h1>
          <p className="text-slate-400">Upload foto sampahmu dan biarkan AI kami menganalisis potensinya.</p>
        </div>

        {!isScanning ? (
          <div className="glassmorphism-card p-8 rounded-3xl">
            {!previewUrl ? (
              <div
                className="border-2 border-dashed border-green-500/30 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-green-500/5 hover:border-green-400 transition-all cursor-pointer group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-4 bg-slate-800 rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-white mb-1">Drag & Drop foto di sini</p>
                  <p className="text-sm text-slate-400">atau klik untuk memilih file</p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-green-500/20 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={resetSelection}
                    className="p-3 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-green-500/30 text-green-400 hover:bg-green-500/10 font-semibold transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                {previewUrl ? 'Ganti Foto' : 'Pilih dari Galeri'}
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold transition-colors opacity-50 cursor-not-allowed"
                title="Fitur kamera dalam pengembangan"
              >
                <Camera className="w-5 h-5" />
                Gunakan Kamera
              </button>
            </div>

            {previewUrl && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={startScan}
                className="w-full mt-6 py-4 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 font-semibold text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
              >
                Analisis dengan Ai
              </motion.button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism-card p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Holographic scanning effect over the image */}
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <img src={previewUrl} alt="Scanning" className="w-full h-full object-cover grayscale opacity-50" />
              <div className="absolute inset-0 border-2 border-green-400/50 rounded-2xl"></div>
              
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:20px_20px] mix-blend-overlay"></div>

              {/* Animated Scan Line */}
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-green-400 shadow-[0_0_15px_rgba(34,197,94,1)] z-10"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent to-green-400/20 z-0 pointer-events-none"
                animate={{ top: ['-32%', '100%', '-32%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <div className="h-12 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={scanStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-mono text-green-400 animate-pulse-glow text-center"
                >
                  {scanMessages[scanStep]}
                </motion.p>
              </AnimatePresence>
            </div>
            
            {/* Processing dots */}
            <div className="flex gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
