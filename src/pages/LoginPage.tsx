import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Key, AlertCircle, Mail, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOwnerLogin, setIsOwnerLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, ownerLogin, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || (isOwnerLogin ? '/dashboard' : '/');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let success = false;
    if (isOwnerLogin) {
      success = await ownerLogin(password);
    } else if (isRegistering) {
      success = await register(email, password, fullName);
      if (success) {
        // Automatically log in after registration
        success = await login(email, password);
      }
    } else {
      success = await login(email, password);
    }

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError(isOwnerLogin ? 'Invalid owner password.' : (isRegistering ? 'Registration failed. Email might already exist.' : 'Invalid email or password.'));
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            {isOwnerLogin ? 'Owner Login' : (isRegistering ? 'Create Account' : 'User Login')}
          </h1>
          <p className="text-zinc-500 text-sm mt-2 text-center">
            {isOwnerLogin 
              ? 'Enter your password to access the dashboard' 
              : (isRegistering ? 'Join ARNE OLSEN to save favorites and track inquiries' : 'Sign in to manage your favorites and inquiries')}
          </p>
        </div>

        <div className="flex p-1 bg-zinc-800 rounded-xl mb-8">
          <button 
            onClick={() => { setIsOwnerLogin(false); setIsRegistering(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isOwnerLogin && !isRegistering ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            User
          </button>
          <button 
            onClick={() => { setIsOwnerLogin(true); setIsRegistering(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isOwnerLogin ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isOwnerLogin && (
            <>
              {isRegistering && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-zinc-600" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-600" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-zinc-600" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
          >
            {isLoading ? 'Processing...' : (isOwnerLogin ? 'Access Dashboard' : (isRegistering ? 'Create Account' : 'Sign In'))}
          </button>
        </form>

        {!isOwnerLogin && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-emerald-500 text-sm font-medium hover:underline"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-600 text-xs">
            {isOwnerLogin ? 'This area is restricted to property owners only.' : 'Secure authentication powered by ARNE OLSEN.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
