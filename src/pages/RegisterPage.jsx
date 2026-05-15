import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { registerUser } from '../utils/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    whatsapp_number: '',
    location: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/etalase');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-[80vh] flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-card p-8 rounded-3xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-green-500/10 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-2">Daftar Akun</h2>
          <p className="text-slate-400">Bergabung untuk memamerkan produk daur ulangmu.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-xl text-white outline-none transition-all" placeholder="Nama Anda" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-xl text-white outline-none transition-all" placeholder="email@contoh.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-xl text-white outline-none transition-all" placeholder="••••••••" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nomor WhatsApp</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <input type="text" name="whatsapp_number" required value={formData.whatsapp_number} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-xl text-white outline-none transition-all" placeholder="081234567890" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Lokasi (Kota/Kabupaten)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-500" />
              </div>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-xl text-white outline-none transition-all" placeholder="Jakarta Selatan" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all mt-6">
            Daftar <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
            Masuk di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
