import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, History, ScanLine, ShoppingBag, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Pindai', path: '/scan', icon: <ScanLine className="w-4 h-4 mr-1" /> },
    { name: 'Riwayat', path: '/history', icon: <History className="w-4 h-4 mr-1" /> },
    { name: 'Etalase', path: '/etalase', icon: <ShoppingBag className="w-4 h-4 mr-1" /> },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glassmorphism py-3' : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
            <Leaf className="text-green-400 w-6 h-6 animate-pulse-glow" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            Sinomi<span className="text-green-400">Ai</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (location.pathname === '/result' && link.path === '/scan');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center text-sm font-medium transition-colors hover:text-green-400 ${isActive ? 'text-green-400' : 'text-slate-300'
                  }`}
              >
                {link.icon}
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-green-400 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
              <span className="text-sm text-green-400 font-medium">Hai, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors" title="Keluar">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center border-l border-white/10 pl-4 ml-2">
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-green-400 transition-colors">
                <LogIn className="w-4 h-4" /> Masuk
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glassmorphism border-t border-white/5 py-4 px-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center text-lg font-medium py-2 transition-colors ${location.pathname === link.path ? 'text-green-400' : 'text-slate-300'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2"></div>
            {user ? (
              <div className="flex flex-col gap-3">
                <span className="text-green-400 font-medium px-1">Hai, {user.name}</span>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-red-400 py-2 hover:bg-red-400/10 rounded-xl px-2 transition-colors w-fit"
                >
                  <LogOut className="w-5 h-5" /> Keluar
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-green-400 font-medium py-2 hover:bg-green-400/10 rounded-xl px-2 transition-colors w-fit"
              >
                <LogIn className="w-5 h-5" /> Masuk Akun
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
