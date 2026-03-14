import { motion } from 'motion/react';
import { Search, Filter, MapPin, Users, Shield, Zap, Heart, DollarSign, SlidersHorizontal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Property } from '../types';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '');
  const [filterType, setFilterType] = useState('All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'All');
  const [filterProject, setFilterProject] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => { setProperties(data); setFilteredProperties(data); setIsLoading(false); });
    if (isAuthenticated) {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => setFavorites(data.map((f: Property) => f.id)));
    }
  }, [isAuthenticated]);

  const toggleFavorite = async (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    const isFav = favorites.includes(propertyId);
    const method = isFav ? 'DELETE' : 'POST';
    try {
      const res = await fetch(`/api/favorites/${propertyId}`, { method });
      if (res.ok) setFavorites(prev => isFav ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
    } catch {}
  };

  useEffect(() => {
    let result = properties;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) || p.location.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) || p.type.toLowerCase().includes(term) || p.project.toLowerCase().includes(term)
      );
    }
    if (filterType !== 'All') result = result.filter(p => p.type === filterType);
    if (minPrice) result = result.filter(p => p.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= parseInt(maxPrice));
    if (bedrooms !== 'All') result = result.filter(p => p.bedrooms >= parseInt(bedrooms));
    if (filterProject !== 'All') result = result.filter(p => p.project === filterProject);
    setFilteredProperties(result);
  }, [searchTerm, filterType, minPrice, maxPrice, bedrooms, filterProject, properties]);

  const clearFilters = () => {
    setSearchTerm(''); setFilterType('All'); setMinPrice(''); setMaxPrice(''); setBedrooms('All'); setFilterProject('All'); setSearchParams({});
  };

  const hasFilters = searchTerm || filterType !== 'All' || minPrice || maxPrice || bedrooms !== 'All' || filterProject !== 'All';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-32">
      {/* Header */}
      <section className="relative bg-zinc-900/50 py-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4 mb-10">
            <span className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-xs">Direct Listings</span>
            <h1 className="text-5xl font-bold text-white">Available Units</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">Browse our curated collection of premium rental units — all managed directly by the owner.</p>
          </div>

          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search location, unit name, or type..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-white/8 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-zinc-600"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center space-x-2 px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all",
                showFilters
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-zinc-900 border-white/8 text-zinc-400 hover:border-white/20 hover:text-white"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasFilters && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
            </button>
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-3.5 rounded-2xl border border-white/8 text-sm text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-all bg-zinc-900">
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                className="bg-zinc-900 border border-white/8 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white appearance-none cursor-pointer">
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Loft">Loft</option>
              </select>
              <select value={filterProject} onChange={e => setFilterProject(e.target.value)}
                className="bg-zinc-900 border border-white/8 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white appearance-none cursor-pointer">
                <option value="All">All Estates</option>
                <option value="AC Estate 1">AC Estate 1</option>
                <option value="AC Estate 2">AC Estate 2</option>
              </select>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/8 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-zinc-600" />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/8 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-zinc-600" />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results count */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          <p className="text-sm text-zinc-500">
            Showing <span className="text-white font-semibold">{filteredProperties.length}</span> unit{filteredProperties.length !== 1 ? 's' : ''}
            {hasFilters && ' matching your filters'}
          </p>
        </div>
      )}

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900 h-[420px] rounded-3xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <>
            {['AC Estate 1', 'AC Estate 2'].map(project => {
              const projectProperties = filteredProperties.filter(p => p.project === project);
              if (projectProperties.length === 0) return null;
              return (
                <div key={project} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">{project}</h2>
                    <div className="h-px flex-grow bg-white/5" />
                    <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">{projectProperties.length} units</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectProperties.map((property) => (
                      <motion.div
                        key={property.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-emerald-500/8 transition-all group"
                      >
                        <Link to={`/property/${property.id}`}>
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={property.image_url}
                              alt={property.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent" />
                            <div className="absolute top-4 left-4 flex gap-2">
                              <span className="bg-zinc-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-white/10">
                                {property.type}
                              </span>
                              {property.featured && (
                                <span className="bg-emerald-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">Featured</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => toggleFavorite(e, property.id)}
                              className={cn(
                                "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all",
                                favorites.includes(property.id)
                                  ? "bg-rose-500 text-white shadow-lg"
                                  : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-900/80 hover:text-white"
                              )}
                            >
                              <Heart className={cn("w-4 h-4", favorites.includes(property.id) && "fill-current")} />
                            </button>
                            <div className="absolute bottom-4 right-4 bg-zinc-950/90 border border-white/10 text-white px-4 py-1.5 rounded-xl font-bold text-sm">
                              ${property.price.toLocaleString()}/mo
                            </div>
                            {property.available_units === 0 && (
                              <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] flex items-center justify-center">
                                <span className="bg-rose-600/90 text-white px-5 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">Fully Occupied</span>
                              </div>
                            )}
                          </div>
                          <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-zinc-500 text-xs">
                                <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-500/70" />
                                {property.location}
                              </div>
                              <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                {property.available_units}/{property.total_units}
                              </div>
                            </div>
                            <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{property.title}</h3>
                            <div className="flex justify-between pt-4 border-t border-white/5 text-xs text-zinc-500">
                              <div className="flex items-center space-x-1.5 bg-zinc-800/50 px-2.5 py-1.5 rounded-lg border border-white/5">
                                <Users className="w-3 h-3 text-emerald-500/70" /><span>{property.bedrooms} Beds</span>
                              </div>
                              <div className="flex items-center space-x-1.5 bg-zinc-800/50 px-2.5 py-1.5 rounded-lg border border-white/5">
                                <Shield className="w-3 h-3 text-emerald-500/70" /><span>{property.bathrooms} Baths</span>
                              </div>
                              <div className="flex items-center space-x-1.5 bg-zinc-800/50 px-2.5 py-1.5 rounded-lg border border-white/5">
                                <Zap className="w-3 h-3 text-emerald-500/70" /><span>{property.area} sqft</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center py-32 space-y-5">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-white/5">
              <Search className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-white">No units found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">Try adjusting your search or clearing the filters.</p>
            <button onClick={clearFilters} className="text-emerald-500 font-semibold text-sm hover:underline">Clear all filters</button>
          </div>
        )}
      </section>
    </motion.div>
  );
}
