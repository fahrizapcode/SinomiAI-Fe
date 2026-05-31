import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Image as ImageIcon, X, Smartphone } from 'lucide-react';
import Webcam from 'react-webcam';
import { useDeteksiSampah } from '../hooks/useDeteksiSampah';

// Detect if user is on a mobile/tablet device
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent));
};

const ScanPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { isReady, statusText, prediksi } = useDeteksiSampah();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setIsCameraOpen(false);
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
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleCameraButton = () => {
    if (isMobileDevice()) {
      // On mobile: trigger native camera input
      cameraInputRef.current?.click();
    } else {
      // On desktop: open inline webcam
      setPreviewUrl('');
      setFile(null);
      setIsCameraOpen(true);
    }
  };

  const captureCamera = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewUrl(imageSrc);
      const arr = imageSrc.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const newFile = new File([u8arr], 'camera-capture.jpg', { type: mime });
      setFile(newFile);
      setIsCameraOpen(false);
    }
  };

  const startScan = async () => {
    if (!file) return;
    setIsScanning(true);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1000);

    try {
      const imgElement = new Image();
      imgElement.src = previewUrl;
      await new Promise((resolve) => { imgElement.onload = resolve; });

      const hasilPrediksi = await prediksi(imgElement);
      const base64 = await convertToBase64(file);

      clearInterval(stepInterval);

      if (hasilPrediksi) {
        const resultPayload = {
          category: hasilPrediksi.label,
          confidence: hasilPrediksi.confidence + '%',
        };
        navigate('/result', { state: { result: resultPayload, image: base64 } });
      } else {
        setIsScanning(false);
        alert('Deteksi gagal.');
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
    'Menganalisis Sampah...',
    'Mengkategorikan Material...',
    'Menghasilkan Rekomendasi Ekonomi Sirkular...',
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 mb-3">Scan Sampah</h1>
          <p className="text-slate-600 text-sm sm:text-base">Upload atau foto sampahmu dan biarkan AI kami menganalisis potensinya.</p>
        </div>

        {!isScanning ? (
          <div className="glassmorphism-card p-5 sm:p-8 rounded-2xl border border-slate-100/80 shadow-md">
            {!previewUrl && !isCameraOpen ? (
              /* Drop Zone */
              <div
                className="border-2 border-dashed border-blue-200 rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-4 shadow-xl rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-semibold text-slate-800 mb-1">Drag & Drop foto di sini</p>
                  <p className="text-xs sm:text-sm text-slate-600">atau klik untuk memilih file</p>
                </div>
              </div>
            ) : isCameraOpen ? (
              /* Desktop Webcam */
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: 'environment' }}
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
              /* Image Preview */
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

            {/* Hidden file inputs */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              ref={cameraInputRef}
              onChange={handleFileChange}
            />

            {/* Action Buttons */}
            <div className="mt-5 sm:mt-8 grid grid-cols-2 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold transition-colors text-sm sm:text-base"
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                {previewUrl ? 'Ganti Foto' : 'Pilih Galeri'}
              </button>
              <button
                onClick={handleCameraButton}
                className="flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold transition-colors text-sm sm:text-base"
              >
                {isMobileDevice()
                  ? <Smartphone className="w-4 h-4 hidden  lg:block sm:w-5 sm:h-5 shrink-0" />
                  : <Camera className="w-4 h-4 hidden lg:block sm:w-5 sm:h-5 shrink-0" />
                }
                Gunakan Kamera
              </button>
            </div>

            {/* Scan Button */}
            {previewUrl && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={startScan}
                disabled={!isReady}
                className="w-full mt-4 sm:mt-6 py-3.5 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base sm:text-lg shadow-md shadow-blue-500/20 hover:shadow-lg transition-all disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
              >
                {!isReady ? statusText : 'Analisis dengan AI'}
              </motion.button>
            )}
          </div>
        ) : (
          /* Scanning State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism-card p-6 sm:p-8 rounded-2xl border border-slate-100/80 shadow-md flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden mb-6 shadow-md">
              <img src={previewUrl} alt="Scanning" className="w-full h-full object-cover" />
            </div>

            <div className="h-12 flex items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={scanStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-base sm:text-lg text-blue-600 font-semibold text-center"
                >
                  {scanMessages[scanStep]}
                </motion.p>
              </AnimatePresence>
            </div>

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
