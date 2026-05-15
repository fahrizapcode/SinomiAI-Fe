import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react';
import { loginUser } from '../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/etalase';
      navigate(redirect);
      window.location.reload(); // Refresh to update navbar
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
          <h2 className="text-3xl font-semibold text-white mb-2">Selamat Datang</h2>
          <p className="text-slate-400">Masuk untuk memamerkan karya daur ulangmu.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-xl text-white outline-none transition-all"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-xl text-white outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-400 text-slate-950 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all mt-4"
          >
            Masuk <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Belum punya akun?{' '}
          <Link to="/register" className="text-green-400 hover:text-green-300 font-medium">
            Daftar sekarang
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
