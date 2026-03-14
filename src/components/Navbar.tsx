import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Info, Phone, Briefcase, Menu, X, LogOut, Heart, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Available Units', path: '/projects', icon: Building2 },
  { name: 'Services', path: '/services', icon: Briefcase },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Contact', path: '/contact', icon: Phone },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated, isOwner, user, logout } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredNavItems = isOwner
    ? [...navItems, { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }]
    : navItems;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-zinc-950/95 backdrop-blur-xl border-b border-white/8 shadow-2xl shadow-black/40"
        : "bg-zinc-950/70 backdrop-blur-md border-b border-white/5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-emerald-700 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                <div className="relative w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Building2 className="text-white w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white leading-none">AC-<span className="text-emerald-400">ESTATE</span></span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold leading-none">Direct Rentals</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                  location.pathname === item.path
                    ? "text-emerald-400"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {!isOwner && (
                  <Link
                    to="/profile"
                    className={cn(
                      "flex items-center space-x-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all",
                      location.pathname === '/profile'
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Saved</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 bg-zinc-900 pl-3 pr-2 py-1.5 rounded-full border border-white/8">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-black text-white">{user?.full_name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 max-w-[90px] truncate">{user?.full_name}</span>
                  <button onClick={logout} className="ml-1 p-1 text-zinc-600 hover:text-rose-400 transition-colors rounded-md" title="Logout">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                Sign In
              </Link>
            )}
            <Link to="/projects" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95">
              Browse Units
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all",
                    location.pathname === item.path
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {isAuthenticated && !isOwner && (
                <Link to="/profile" onClick={() => setIsOpen(false)}
                  className={cn("flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all",
                    location.pathname === '/profile' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}>
                  <Heart className="w-4 h-4" /><span>Saved Properties</span>
                </Link>
              )}
              <div className="pt-3 space-y-2 border-t border-white/5 mt-3">
                <Link to="/projects" onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 transition-colors">
                  Browse Available Units
                </Link>
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-all">
                    <LogOut className="w-4 h-4" /><span>Sign Out ({user?.full_name})</span>
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                    <UserIcon className="w-4 h-4" /><span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
