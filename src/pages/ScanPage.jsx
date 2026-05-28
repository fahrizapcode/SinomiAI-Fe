import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';
import { useDeteksiSampah } from '../hooks/useDeteksiSampah';
import { addHistory } from '../utils/db';

const ScanPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { isReady, statusText, isPredicting, hasil, prediksi, resetHasil } = useDeteksiSampah();

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
      // Create image element for TFJS
      const imgElement = new Image();
      imgElement.src = previewUrl;
      await new Promise((resolve) => { imgElement.onload = resolve; });

      const hasilPrediksi = await prediksi(imgElement);

      const base64 = await convertToBase64(file);

      clearInterval(stepInterval);

      if (hasilPrediksi) {
        const resultPayload = {
          category: hasilPrediksi.label,
          confidence: hasilPrediksi.confidence + "%"
        };
        navigate('/result', { state: { result: resultPayload, image: base64 } });
      } else {
        setIsScanning(false);
        alert("Deteksi gagal.");
      }
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
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">Scan Sampah</h1>
          <p className="text-slate-600">Upload foto sampahmu dan biarkan AI kami menganalisis potensinya.</p>
        </div>

        {!isScanning ? (
          <div className="glassmorphism-card p-8 rounded-2xl border border-slate-100/80 shadow-md">
            {!previewUrl ? (
              <div
                className="border-2 border-dashed border-blue-200 rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-4 bg-blue-50 rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-800 mb-1">Drag & Drop foto di sini</p>
                  <p className="text-sm text-slate-600">atau klik untuk memilih file</p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-blue-100 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={resetSelection}
                    className="p-3 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
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
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                {previewUrl ? 'Ganti Foto' : 'Pilih dari Galeri'}
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 font-semibold transition-colors opacity-50 cursor-not-allowed"
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
                disabled={!isReady}
                className="w-full mt-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md shadow-blue-500/20 hover:shadow-lg transition-all disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
              >
                {!isReady ? statusText : 'Analisis dengan AI'}
              </motion.button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism-card p-8 rounded-2xl border border-slate-100/80 shadow-md flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Simple scanning line over image */}
            <div className="relative w-full max-w-sm aspect-square rounded-xl overflow-hidden mb-8 shadow-md">
              <img src={previewUrl} alt="Scanning" className="w-full h-full object-cover" />

              {/* Animated Scan Line */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="h-12 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={scanStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-mono text-blue-600 font-semibold text-center"
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
                  className="w-2.5 h-2.5 rounded-full bg-blue-600"
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
