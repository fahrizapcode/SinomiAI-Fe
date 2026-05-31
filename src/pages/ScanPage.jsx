import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';
import Webcam from 'react-webcam';
import { useDeteksiSampah } from '../hooks/useDeteksiSampah';
import { addHistory } from '../utils/db';

const ScanPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
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
    setIsCameraOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const captureCamera = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewUrl(imageSrc);
      // Convert base64 to File object
      const arr = imageSrc.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const newFile = new File([u8arr], "camera-capture.jpg", { type: mime });
      setFile(newFile);
      setIsCameraOpen(false);
    }
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
            {!previewUrl && !isCameraOpen ? (
              <div
                className="border-2 border-dashed border-blue-200 rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-4 shadow-xl rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-800 mb-1">Drag & Drop foto di sini</p>
                  <p className="text-sm text-slate-600">atau klik untuk memilih file</p>
                </div>
              </div>
            ) : isCameraOpen ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex flex-col items-center justify-center group">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "environment" }}
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={captureCamera}
                    className="p-4 bg-white text-blue-600 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
                    title="Ambil Foto"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setIsCameraOpen(false)}
                    className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                    title="Batal"
                  >
                    <X className="w-6 h-6" />
                  </button>
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
                onClick={() => {
                  setPreviewUrl('');
                  setIsCameraOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold transition-colors"
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
            </div>

            <div className="h-12 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={scanStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg text-blue-600 font-semibold text-center"
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
