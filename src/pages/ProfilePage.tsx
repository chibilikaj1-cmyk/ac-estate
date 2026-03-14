import { apiUrl } from '../lib/utils';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Property, PropertyApplication } from '../types';
import { Heart, MessageSquare, MapPin, ArrowRight, Trash2, Calendar, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [applications, setApplications] = useState<PropertyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const [favsRes, appsRes] = await Promise.all([
            fetch(apiUrl('/api/favorites'),
            fetch(apiUrl('/api/my-applications')
          ]);
          if (favsRes.ok) setFavorites(await favsRes.json());
          if (appsRes.ok) setApplications(await appsRes.json());
        } catch (error) {
          console.error("Failed to fetch profile data", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  const removeFavorite = async (propertyId: number) => {
    try {
      const res = await fetch(`/api/favorites/${propertyId}`, { method: 'DELETE' });
      if (res.ok) {
        setFavorites(favorites.filter(f => f.id !== propertyId));
      }
    } catch (error) {
      console.error("Failed to remove favorite", error);
    }
  };

  if (authLoading || isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
    >
      {/* Profile Header */}
      <section className="bg-zinc-900/50 p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-600/20">
            {user?.full_name.charAt(0)}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-bold text-white">{user?.full_name}</h1>
            <p className="text-zinc-500">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="bg-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold text-zinc-400 border border-white/5">
                Member since 2026
              </div>
              <div className="bg-emerald-500/10 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-500 border border-emerald-500/10">
                Verified Resident
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Favorites */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Heart className="w-6 h-6 text-emerald-500" />
              Saved Properties
            </h2>
            <span className="text-sm text-zinc-500 font-medium">{favorites.length} items</span>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {favorites.map((property) => (
                <motion.div
                  key={property.id}
                  layout
                  className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row gap-6 group hover:shadow-xl transition-all"
                >
                  <div className="w-full sm:w-40 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={property.image_url} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center text-zinc-500 text-xs font-bold uppercase tracking-widest">
                      <MapPin size={12} className="text-emerald-500 mr-1" />
                      {property.location}
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-500 transition-colors">{property.title}</h3>
                    <div className="text-emerald-500 font-bold">${property.price.toLocaleString()}/mo</div>
                  </div>
                  <div className="flex sm:flex-col justify-between items-end gap-2">
                    <button 
                      onClick={() => removeFavorite(property.id)}
                      className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 size={20} />
                    </button>
                    <Link to={`/property/${property.id}`} className="p-2 bg-zinc-800 rounded-xl text-emerald-500 hover:bg-zinc-700 transition-all">
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-dashed border-white/10 p-12 rounded-[2.5rem] text-center space-y-4">
              <Heart className="w-12 h-12 text-zinc-800 mx-auto" />
              <p className="text-zinc-500">You haven't saved any properties yet.</p>
              <Link to="/projects" className="inline-block text-emerald-500 font-bold hover:underline">Browse available units</Link>
            </div>
          )}
        </div>

        {/* Inquiries */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-emerald-500" />
              My Inquiries
            </h2>
            <span className="text-sm text-zinc-500 font-medium">{applications.length} total</span>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-zinc-900 p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white line-clamp-1">{app.property_title}</h4>
                      <div className="flex items-center text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                        <Calendar className="w-3 h-3 mr-1" />
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      app.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {app.status}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2 italic">"{app.message}"</p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center text-xs text-zinc-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Awaiting review
                    </div>
                    <Link to={`/property/${app.property_id}`} className="text-xs font-bold text-emerald-500 hover:underline">View Property</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-dashed border-white/10 p-12 rounded-[2.5rem] text-center space-y-4">
              <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto" />
              <p className="text-zinc-500">No inquiries submitted yet.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
